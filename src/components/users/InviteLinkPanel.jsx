import { useState } from 'react';
import Button from '../ui/Button';

export default function InviteLinkPanel({ link }) {
  const [copied, setCopied] = useState(false);

  if (!link) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      // Clipboard access can fail due to permissions or non-secure contexts.
      console.error('Failed to copy invite link', error);
    }
  };

  return (
    <div className="mt-3 text-sm">
      <div className="font-medium">Invite Link:</div>
      <div className="mt-1 flex items-start gap-2">
        <div className="flex-1 p-2 bg-gray-100 rounded break-all">{link}</div>
        <Button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-3 py-2"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}
