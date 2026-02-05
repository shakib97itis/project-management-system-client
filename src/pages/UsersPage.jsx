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
import Card from '../components/ui/Card';
import InviteLinkPanel from '../components/users/InviteLinkPanel';
import InviteUserForm from '../components/users/InviteUserForm';
import PaginationControls from '../components/users/PaginationControls';
import UsersList from '../components/users/UsersList';
import {getUserId} from '../utils/ids';

const USERS_QUERY_KEY = ['users'];
const PAGE_SIZE = 10;

const buildInviteLink = (response) => {
  // API may return a full invite link or a token to build the registration URL.
  if (response?.inviteLink) {
    return `${window.location.origin}${response.inviteLink}`;
  }
  const token = response?.invite?.token || response?.token;
  return token ? `${window.location.origin}/register?token=${token}` : '';
};

export default function UsersPage() {
  const {user} = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('STAFF');
  const [inviteLink, setInviteLink] = useState('');
  const currentUserId = getUserId(user);
  const isAdmin = user?.role === 'ADMIN';

  const usersQuery = useQuery({
    queryKey: [...USERS_QUERY_KEY, currentPage],
    queryFn: () => getUsersApi(currentPage, PAGE_SIZE),
    keepPreviousData: true,
  });

  const inviteMutation = useMutation({
    mutationFn: inviteUserApi,
    onSuccess: (res) => {
      setInviteLink(buildInviteLink(res));
      setInviteEmail('');
      queryClient.invalidateQueries({queryKey: USERS_QUERY_KEY});
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({id, role}) => updateUserRoleApi(id, role),
    onSuccess: () => queryClient.invalidateQueries({queryKey: USERS_QUERY_KEY}),
  });

  const statusMutation = useMutation({
    mutationFn: ({id, status}) => updateUserStatusApi(id, status),
    onSuccess: () => queryClient.invalidateQueries({queryKey: USERS_QUERY_KEY}),
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
      <Card>
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
      </Card>

      <Card>
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
          page={currentPage}
          onPrev={() => setCurrentPage((p) => p - 1)}
          onNext={() => setCurrentPage((p) => p + 1)}
        />
      </Card>
    </div>
  );
}
