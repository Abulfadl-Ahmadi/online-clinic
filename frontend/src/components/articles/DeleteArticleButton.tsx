"use client";

interface DeleteArticleButtonProps {
  onDelete: () => void;
}

export function DeleteArticleButton({ onDelete }: DeleteArticleButtonProps) {
  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm("آیا از حذف این مقاله مطمئن هستید؟")) {
      onDelete();
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="text-xs text-destructive hover:underline"
    >
      حذف مقاله
    </button>
  );
}
