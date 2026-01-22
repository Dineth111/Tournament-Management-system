import React from 'react';

type User = { id: string; name: string; email: string; role: 'admin'|'player'|'judge'|'coach'|'organizer' } | null;
type Props = { user?: User };

const AdminTeams: React.FC<Props> = ({ user }) => {
  if (!user) {
    return <div>user not found</div>;
  }

  return (
    <div>
      {/* ...existing code... */}
    </div>
  );
};

export default AdminTeams;