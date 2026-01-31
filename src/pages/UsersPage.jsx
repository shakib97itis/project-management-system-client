import {useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {inviteUserApi} from '../api/auth.api';
import {
  getUsersApi,
  updateUserRoleApi,
  updateUserStatusApi,
} from '../api/users.api';
import {queryClient} from '../app/queryClient';

export default function UsersPage() {
  const [page, setPage] = useState(1);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('STAFF');
  const [inviteLink, setInviteLink] = useState('');

  const q = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsersApi(page, 10),
    keepPreviousData: true,
  });

  const inviteM = useMutation({
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

  const roleM = useMutation({
    mutationFn: ({id, role}) => updateUserRoleApi(id, role),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['users']}),
  });

  const statusM = useMutation({
    mutationFn: ({id, status}) => updateUserStatusApi(id, status),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['users']}),
  });

  const items = q.data?.items || [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold">User Management</h1>

        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Invite email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />

          <select
            className="border rounded px-3 py-2"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="STAFF">STAFF</option>
          </select>

          <button
            className="rounded bg-gray-900 text-white px-3 py-2"
            onClick={() =>
              inviteM.mutate({email: inviteEmail, role: inviteRole})
            }
            disabled={inviteM.isPending}
          >
            {inviteM.isPending ? 'Inviting...' : 'Send Invite'}
          </button>
        </div>

        {inviteLink && (
          <div className="mt-3 text-sm">
            <div className="font-medium">Invite Link (copy):</div>
            <div className="mt-1 p-2 bg-gray-100 rounded break-all">
              {inviteLink}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {q.isLoading && <p>Loading users...</p>}
        {q.isError && <p className="text-red-600">Failed to load users</p>}

        <div className="space-y-3">
          {items.map((u) => (
            <div
              key={u.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="font-medium">
                  {u.name}{' '}
                  <span className="text-xs text-gray-500">({u.email})</span>
                </div>
                <div className="text-xs text-gray-500">
                  Role: {u.role} • Status: {u.status}
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  className="border rounded px-2 py-1"
                  value={u.role}
                  onChange={(e) =>
                    roleM.mutate({id: u.id, role: e.target.value})
                  }
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="STAFF">STAFF</option>
                </select>

                <button
                  className="px-3 py-1.5 rounded border"
                  onClick={() =>
                    statusM.mutate({
                      id: u.id,
                      status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                    })
                  }
                >
                  {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="px-3 py-1.5 border rounded"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <button
            className="px-3 py-1.5 border rounded"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
