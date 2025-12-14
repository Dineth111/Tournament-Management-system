import React from 'react';

type User = { id: string; name: string; email: string; role: 'admin'|'player'|'judge'|'coach'|'organizer' } | null;
type Props = { user?: User };

const AdminMatches: React.FC<Props> = ({ user }) => {
  return (
    <div>
      {/* ...existing code... */}
    </div>
  );
};

export default AdminMatches;