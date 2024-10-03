import { ThumbnailUpload } from "@/app/create/thumbnail-upload";
import { Button } from "@/components/ui/button";
import { useMutationErrorHandler } from "@/hooks/use-mutation-error-handler";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const VoteOption = ({
  imageId,
  title,
}: {
  imageId: string;
  title: string;
}) => {
  const { session } = useSession();
  const { handleError } = useMutationErrorHandler();
  const { thumbnailPollId } = useParams<{
    thumbnailPollId: Id<"thumbnailPolls">;
  }>();
  const voteOnThumbnail = useMutation(api.thumbnailPolls.voteOnThumbnailPoll);
  const { toast } = useToast();
  const poll = useQuery(api.thumbnailPolls.getThumbnailPoll, {
    thumbnailPollId,
  });
  const hasVoted = session && poll?.votedUserIds.includes(session.user.id);

  const vote = async () => {
    try {
      await voteOnThumbnail({
        imageId,
        thumbnailPollId,
      });

      toast({
        title: `You voted for ${title}!`,
        description: "Your vote has been recorded.",
        variant: "default",
        duration: 5000,
      });
    } catch (error: unknown) {
      handleError(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ThumbnailUpload
        imageId={imageId}
        onUploadComplete={() => {}}
        showUpload={false}
        title={title}
      />
      {session && !hasVoted && (
        <Button size="lg" className="mt-5 w-[200px] mb-6" onClick={vote}>
          Vote
        </Button>
      )}
    </div>
  );
};
