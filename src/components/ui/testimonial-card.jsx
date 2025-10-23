import { cn } from "../../lib/utils"

export function TestimonialCard({ 
  author, 
  text, 
  href, 
  className 
}) {
  const CardContent = () => (
    <div className={cn(
      "flex w-80 flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm",
      "hover:shadow-md transition-shadow duration-200",
      className
    )}>
      <div className="flex items-center gap-3">
        <img
          src={author.avatar}
          alt={`${author.name} avatar`}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{author.name}</span>
          <span className="text-xs text-muted-foreground">{author.handle}</span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  )

  if (href) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-105"
      >
        <CardContent />
      </a>
    )
  }

  return <CardContent />
}
