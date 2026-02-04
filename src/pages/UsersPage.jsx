import {useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {inviteUserApi} from '../api/auth.api';
import {
  getUsersApi,
  updateUserRoleApi,
  updateUserStatusApi,
} from '../api/users.api';
import {queryClient} from '../app/queryClient';
import {useAuth} from '../auth/AuthProvider';
import InviteLinkPanel from '../components/users/InviteLinkPanel';
import InviteUserForm from '../components/users/InviteUserForm';
import PaginationControls from '../components/users/PaginationControls';
import UsersList from '../components/users/UsersList';

export default function UsersPage() {
  const {user} = useAuth();
  const [page, setPage] = useState(1);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('STAFF');
  const [inviteLink, setInviteLink] = useState('');
  const currentUserId = user?._id ?? user?.id;
  const isAdmin = user?.role === 'ADMIN';

  const usersQuery = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsersApi(page, 10),
    keepPreviousData: true,
  });

  const inviteMutation = useMutation({
    mutationFn: inviteUserApi,
    onSuccess: (res) => {
      const link = res.inviteLink
        ? `${window.location.origin}${res.inviteLink}`
        : `${window.location.origin}/register?token=${res.invite.token}`;
      setInviteLink(link);
      setInviteEmail('');
      queryClient.invalidateQueries({queryKey: ['users']});
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({id, role}) => updateUserRoleApi(id, role),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['users']}),
  });

  const statusMutation = useMutation({
    mutationFn: ({id, status}) => updateUserStatusApi(id, status),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['users']}),
  });

  const items = usersQuery.data?.items || [];
  const isInviting = inviteMutation.isPending;

  const handleInvite = () =>
    inviteMutation.mutate({email: inviteEmail, role: inviteRole});

  const handleRoleChange = (id, role) => roleMutation.mutate({id, role});

  const handleStatusToggle = (id, status) => {
    if (isAdmin && currentUserId && id === currentUserId) {
      return;
    }
    statusMutation.mutate({id, status});
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold">User Management</h1>

        <InviteUserForm
          email={inviteEmail}
          role={inviteRole}
          onEmailChange={setInviteEmail}
          onRoleChange={setInviteRole}
          onSubmit={handleInvite}
          isSubmitting={isInviting}
        />

        <InviteLinkPanel link={inviteLink} />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <UsersList
          users={items}
          isLoading={usersQuery.isLoading}
          isError={usersQuery.isError}
          onRoleChange={handleRoleChange}
          onStatusToggle={handleStatusToggle}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />

        <PaginationControls
          page={page}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      </div>
    </div>
  );
}
