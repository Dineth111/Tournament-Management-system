const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

// Use native fetch if available, else lazy-load node-fetch
const getFetch = async () => {
  if (typeof fetch === 'function') return fetch;
  const mod = await import('node-fetch');
  return mod.default;
};

const buildSystemPrompt = (role = 'guest') => {
  // Sinhala + English bilingual guidance with role context
  return [
    `You are an AI assistant for a Tournament Management System.`,
    `Support Sinhala and English. Detect user's language; respond in Sinhala if they write Sinhala, otherwise English.`,
    `When unclear, ask concise follow-ups. Be brief and actionable.`,
    `Role context: ${role}. Tailor answers accordingly.`,
    `Core capabilities:`,
    `- Guide new users through registration, login, and navigation (guest users).`,
    `- Help players and coaches with tournament info, match schedules, and preparation.`,
    `- Provide real-time help for referees (judges) and organizers during events (rules, reporting, scheduling).`,
    `- If the user asks for data that exists in the app (teams, matches, tournaments), provide steps to find it via the UI routes.`,
    `- Keep messages concise, numbered steps where helpful, and include relevant page names.`,
  ].join('\n');
};

const detectProviderFromKey = (key) => {
  if (!key || typeof key !== 'string') return 'unknown';
  if (key.startsWith('sk-')) return 'openai';
  if (key.startsWith('AIza')) return 'google';
  return 'unknown';
};

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Determine user and role from session
    const userId = req.session?.userId || null;
    const sessionRole = req.session?.userRole || 'guest';

    // Build prompt
    const systemPrompt = buildSystemPrompt(sessionRole);

    const fetchFn = await getFetch();
    const apiKey = process.env.OPENAI_API_KEY;
    const provider = detectProviderFromKey(apiKey);
    const openAiModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const googleModel = process.env.GOOGLE_MODEL || 'gemini-2.5-flash';

    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'AI API key not configured' });
    }
    if (provider === 'unknown') {
      return res.status(500).json({
        success: false,
        message: 'API key invalid or unsupported',
        error: 'Use an OpenAI key starting with "sk-" or a Google key starting with "AIza".'
      });
    }

    let reply = '';
    let usedModel = openAiModel;

    if (provider === 'openai') {
      const body = {
        model: openAiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.3,
      };

      const response = await fetchFn('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        let errJson = null;
        try { errJson = JSON.parse(errText); } catch {}
        const errMsg = errJson?.error?.message || 'OpenAI API error';
        console.error('OpenAI error:', errJson || errText);
        return res.status(response.status).json({ success: false, message: errMsg, error: errJson || errText });
      }

      const data = await response.json();
      reply = data?.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';
      usedModel = openAiModel;
    } else if (provider === 'google') {
      const url = `https://generativelanguage.googleapis.com/v1/models/${googleModel}:generateContent?key=${apiKey}`;
      const body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${buildSystemPrompt(sessionRole)}\n\n${message}` }],
          },
        ],
        generationConfig: { temperature: 0.3 },
      };

      const response = await fetchFn(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        let errJson = null;
        try { errJson = JSON.parse(errText); } catch {}
        const errMsg = errJson?.error?.message || 'Google Gemini API error';
        console.error('Google Gemini error:', errJson || errText);
        return res.status(response.status).json({ success: false, message: errMsg, error: errJson || errText });
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      reply = parts.map(p => p?.text || '').join('').trim() || 'Sorry, I could not generate a response.';
      usedModel = googleModel;
    }

    // Persist the chat turn (non-blocking for DB failures)
    try {
      const chatDoc = new ChatMessage({
        user: userId,
        role: sessionRole || 'guest',
        message,
        reply,
        meta: {
          model: usedModel,
        },
      });
      await chatDoc.save();
    } catch (saveErr) {
      console.warn('ChatMessage save failed, continuing without persistence:', saveErr?.message || saveErr);
    }

    return res.json({ success: true, data: { reply } });
  } catch (error) {
    console.error('Chatbot sendMessage error:', error);
    return res.status(500).json({ success: false, message: 'Server error generating reply' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.session?.userId || null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '20', 10), 1);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ChatMessage.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ChatMessage.countDocuments({ user: userId }),
    ]);

    return res.json({
      success: true,
      data: {
        items,
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error('Chatbot getHistory error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
};