import React from 'react';

type User = { id: string; name: string; email: string; role: 'admin'|'player'|'judge'|'coach'|'organizer' } | null;
type Props = { user?: User };

const AdminCoaches: React.FC<Props> = ({ user }) => {
  // you can safely use `user` here (check for null)
  return (
    <div>
      {/* ...existing code... */}
    </div>
  );
};

export default AdminCoaches;