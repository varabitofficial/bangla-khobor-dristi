
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Reply, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

interface CommentSectionProps {
  postId: string;
}

interface CommentItemProps {
  comment: any;
  postId: string;
  depth?: number;
}

const CommentItem = ({ comment, postId, depth = 0 }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuth();
  const { mutate: createComment, isPending: isSubmitting } = useCreateComment();

  const handleReply = () => {
    if (!replyContent.trim()) return;
    
    createComment({
      content: replyContent,
      postId,
      parentId: comment.id,
    }, {
      onSuccess: () => {
        setReplyContent('');
        setShowReplyForm(false);
      },
    });
  };

  const isOwnComment = user?.id === comment.user_id;
  const isPending = !comment.is_approved;

  return (
    <div className={`${depth > 0 ? 'ml-8 pt-4 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.profiles?.avatar_url} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className={`bg-gray-50 rounded-lg p-3 ${isPending && isOwnComment ? 'border border-yellow-300 bg-yellow-50' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.profiles?.full_name}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), { 
                  addSuffix: true, 
                  locale: bn 
                })}
              </span>
              {isPending && isOwnComment && (
                <div className="flex items-center gap-1 text-xs text-yellow-600">
                  <Clock className="h-3 w-3" />
                  <span>অনুমোদনের অপেক্ষায়</span>
                </div>
              )}
            </div>
            <p className="text-gray-800">{comment.content}</p>
          </div>
          
          {user && depth < 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="mt-1 text-xs"
            >
              <Reply className="h-3 w-3 mr-1" />
              উত্তর দিন
            </Button>
          )}
          
          {showReplyForm && (
            <div className="mt-2 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="আপনার উত্তর লিখুন..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleReply} 
                  size="sm"
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? 'পোস্ট হচ্ছে...' : 'উত্তর দিন'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  বাতিল
                </Button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply: any) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ postId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { data: comments, isLoading } = useComments(postId);
  const { mutate: createComment, isPending: isSubmitting } = useCreateComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    createComment({
      content: newComment,
      postId,
    }, {
      onSuccess: () => {
        setNewComment('');
      },
    });
  };

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        মতামত ({comments?.length || 0})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="আপনার মতামত লিখুন..."
            className="min-h-[120px] mb-4"
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'পোস্ট হচ্ছে...' : 'মতামত দিন'}
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            আপনার মতামত অনুমোদনের পর প্রকাশিত হবে।
          </p>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-3">মতামত দিতে লগইন করুন</p>
          <Link to="/auth">
            <Button>লগইন করুন</Button>
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="bg-gray-200 rounded-lg p-3">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>এখনও কোনো মতামত নেই। প্রথম মতামত দিন!</p>
        </div>
      )}
    </section>
  );
};

export default CommentSection;
