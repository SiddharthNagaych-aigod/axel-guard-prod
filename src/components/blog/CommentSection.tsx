'use client';

import { useState, useTransition } from 'react';
import { addComment } from '@/app/blog/actions';
import type { Comment } from '@/app/blog/actions';
import { User, MessageSquare, Send } from 'lucide-react';

interface CommentSectionProps {
  slug: string;
  initialComments: Comment[];
}

export default function CommentSection({ slug, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await addComment(formData);
      if (result.success) {
        // Optimistically update or just reset form since we revalidatePath
        // Actually, since revalidatePath happens on server, we might need to refresh router or manual state update
        // simple state update for immediate feedback:
        const newComment: Comment = {
          id: Date.now().toString(),
          slug,
          name: formData.get('name') as string,
          content: formData.get('content') as string,
          date: new Date().toISOString()
        };
        setComments([newComment, ...comments]);
        setMessage('Comment posted successfully!');
        (document.getElementById('comment-form') as HTMLFormElement).reset();
      } else {
        setMessage('Failed to post comment.');
      }
    });
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-white/5 py-16 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-900 dark:text-white font-[family-name:var(--font-raleway)]">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Comments ({comments.length})
        </h3>

        {/* List */}
        <div className="space-y-6 mb-12">
          {comments.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 italic">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 flex gap-4 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{comment.name}</span>
                    <span className="text-xs text-slate-400">• {new Date(comment.date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-[family-name:var(--font-roboto)]">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 transition-colors">
          <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Leave a Reply</h4>
          <form id="comment-form" action={handleSubmit} className="space-y-4">
            <input type="hidden" name="slug" value={slug} />
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input 
                type="text" 
                name="name" 
                id="name"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Comment</label>
              <textarea 
                name="content" 
                id="content"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
                placeholder="Share your thoughts..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isPending ? 'Posting...' : 'Post Comment'}
            </button>

            {message && <p className="text-sm text-green-600 font-medium mt-2">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
