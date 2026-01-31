import { useState, useEffect } from 'react'
import { } from 'framer-motion'

// Custom hook for reduced motion preference
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

type AnimationType = 'pulse' | 'wave' | 'none'

interface BaseSkeletonProps {
  className?: string
  animation?: AnimationType
}

// Base skeleton element with shimmer animation
function SkeletonBase({
  className = '',
  animation = 'wave',
  style,
}: BaseSkeletonProps & { style?: React.CSSProperties }) {
  const prefersReducedMotion = useReducedMotion()
  const effectiveAnimation = prefersReducedMotion ? 'none' : animation

  const animationClass = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  }[effectiveAnimation]

  return (
    <>
      <div
        className={`
          bg-white/10 rounded-lg overflow-hidden relative
          ${animationClass}
          ${className}
        `}
        style={style}
        aria-hidden="true"
      >
        {effectiveAnimation === 'wave' && (
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        )}
      </div>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .skeleton-wave {
          overflow: hidden;
        }
      `}</style>
    </>
  )
}

// ============================================================================
// 1. TextSkeleton - For text lines
// ============================================================================
interface TextSkeletonProps extends BaseSkeletonProps {
  lines?: number
  lastLineWidth?: string
}

export function TextSkeleton({
  lines = 3,
  lastLineWidth = '60%',
  className = '',
  animation = 'wave',
}: TextSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className="h-4"
          style={{ 
            width: i === lines - 1 ? lastLineWidth : '100%' 
          }}
          animation={animation}
        />
      ))}
    </div>
  )
}

// ============================================================================
// 2. AvatarSkeleton - Circular avatar placeholder
// ============================================================================
interface AvatarSkeletonProps extends BaseSkeletonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  withText?: boolean
}

const avatarSizes = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

export function AvatarSkeleton({
  size = 'md',
  withText = false,
  className = '',
  animation = 'wave',
}: AvatarSkeletonProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <SkeletonBase
        className={`${avatarSizes[size]} rounded-full`}
        animation={animation}
      />
      {withText && (
        <div className="space-y-2 flex-1">
          <SkeletonBase className="h-4 w-32" animation={animation} />
          <SkeletonBase className="h-3 w-24" animation={animation} />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 3. CardSkeleton - Full card placeholder
// ============================================================================
interface CardSkeletonProps extends BaseSkeletonProps {
  hasImage?: boolean
  imageHeight?: number
  hasAvatar?: boolean
  hasActions?: boolean
}

export function CardSkeleton({
  hasImage = true,
  imageHeight = 160,
  hasAvatar = false,
  hasActions = false,
  className = '',
  animation = 'wave',
}: CardSkeletonProps) {
  return (
    <div
      className={`
        rounded-2xl overflow-hidden
        bg-neutral-900/50 border border-white/10
        ${className}
      `}
    >
      {/* Image */}
      {hasImage && (
        <SkeletonBase
          className="w-full rounded-none"
          style={{ height: imageHeight }}
          animation={animation}
        />
      )}
      
      <div className="p-5 space-y-4">
        {/* Header with optional avatar */}
        {hasAvatar ? (
          <AvatarSkeleton withText animation={animation} />
        ) : (
          <div className="space-y-2">
            <SkeletonBase className="h-5 w-3/4" animation={animation} />
            <SkeletonBase className="h-4 w-1/2" animation={animation} />
          </div>
        )}
        
        {/* Content */}
        <TextSkeleton lines={2} animation={animation} />
        
        {/* Actions */}
        {hasActions && (
          <div className="flex gap-3 pt-2">
            <SkeletonBase className="h-9 flex-1" animation={animation} />
            <SkeletonBase className="h-9 flex-1" animation={animation} />
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// 4. ListItemSkeleton - For list items
// ============================================================================
interface ListItemSkeletonProps extends BaseSkeletonProps {
  hasImage?: boolean
  hasActions?: boolean
  count?: number
}

export function ListItemSkeleton({
  hasImage = true,
  hasActions = false,
  count = 1,
  className = '',
  animation = 'wave',
}: ListItemSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 border border-white/10"
        >
          {hasImage && (
            <SkeletonBase className="w-12 h-12 rounded-lg shrink-0" animation={animation} />
          )}
          
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-4 w-48" animation={animation} />
            <SkeletonBase className="h-3 w-32" animation={animation} />
          </div>
          
          {hasActions && (
            <div className="flex gap-2 shrink-0">
              <SkeletonBase className="w-8 h-8 rounded-lg" animation={animation} />
              <SkeletonBase className="w-8 h-8 rounded-lg" animation={animation} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 5. TableSkeleton - For data tables
// ============================================================================
interface TableSkeletonProps extends BaseSkeletonProps {
  rows?: number
  columns?: number
  hasHeader?: boolean
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className = '',
  animation = 'wave',
}: TableSkeletonProps) {
  return (
    <div className={`rounded-xl overflow-hidden border border-white/10 ${className}`}>
      <table className="w-full">
        {hasHeader && (
          <thead className="bg-white/5">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <SkeletonBase className="h-4 w-20" animation={animation} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={rowIndex % 2 === 0 ? 'bg-neutral-900/30' : 'bg-neutral-900/50'}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <SkeletonBase 
                    className="h-4" 
                    style={{ width: `${60 + Math.random() * 40}%` }}
                    animation={animation} 
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// 6. FormSkeleton - For form layouts
// ============================================================================
interface FormSkeletonProps extends BaseSkeletonProps {
  fields?: number
  hasSubmit?: boolean
}

export function FormSkeleton({
  fields = 3,
  hasSubmit = true,
  className = '',
  animation = 'wave',
}: FormSkeletonProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBase className="h-4 w-24" animation={animation} />
          <SkeletonBase className="h-11 w-full" animation={animation} />
        </div>
      ))}
      
      {hasSubmit && (
        <SkeletonBase className="h-11 w-full" animation={animation} />
      )}
    </div>
  )
}

// ============================================================================
// 7. ProfileSkeleton - User profile layout
// ============================================================================
interface ProfileSkeletonProps extends BaseSkeletonProps {
  showCover?: boolean
  showStats?: boolean
}

export function ProfileSkeleton({
  showCover = true,
  showStats = true,
  className = '',
  animation = 'wave',
}: ProfileSkeletonProps) {
  return (
    <div className={`rounded-2xl overflow-hidden bg-neutral-900/50 border border-white/10 ${className}`}>
      {/* Cover */}
      {showCover && (
        <SkeletonBase 
          className="w-full h-32 rounded-none" 
          animation={animation} 
        />
      )}
      
      <div className="px-6 pb-6">
        {/* Avatar - overlapping cover */}
        <div className={showCover ? '-mt-10' : 'pt-6'}>
          <SkeletonBase 
            className="w-20 h-20 rounded-full border-4 border-neutral-900" 
            animation={animation} 
          />
        </div>
        
        {/* Name & bio */}
        <div className="mt-4 space-y-2">
          <SkeletonBase className="h-6 w-40" animation={animation} />
          <SkeletonBase className="h-4 w-32" animation={animation} />
        </div>
        
        {/* Bio */}
        <div className="mt-4">
          <TextSkeleton lines={2} animation={animation} />
        </div>
        
        {/* Stats */}
        {showStats && (
          <div className="flex gap-6 mt-6 pt-6 border-t border-white/10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <SkeletonBase className="h-6 w-12 mx-auto" animation={animation} />
                <SkeletonBase className="h-3 w-16 mt-1" animation={animation} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// 8. MediaGridSkeleton - For image/video grids
// ============================================================================
interface MediaGridSkeletonProps extends BaseSkeletonProps {
  items?: number
  columns?: 2 | 3 | 4
  aspectRatio?: 'square' | 'video' | 'portrait'
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
}

export function MediaGridSkeleton({
  items = 6,
  columns = 3,
  aspectRatio = 'square',
  className = '',
  animation = 'wave',
}: MediaGridSkeletonProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={`${aspectRatioClasses[aspectRatio]} rounded-xl`}
          animation={animation}
        />
      ))}
    </div>
  )
}

// ============================================================================
// 9. ArticleSkeleton - Blog/article layout
// ============================================================================
interface ArticleSkeletonProps extends BaseSkeletonProps {
  hasImage?: boolean
}

export function ArticleSkeleton({
  hasImage = true,
  className = '',
  animation = 'wave',
}: ArticleSkeletonProps) {
  return (
    <article className={`max-w-2xl mx-auto ${className}`}>
      {/* Title */}
      <div className="space-y-3 mb-6">
        <SkeletonBase className="h-8 w-4/5" animation={animation} />
        <SkeletonBase className="h-8 w-2/3" animation={animation} />
      </div>
      
      {/* Meta */}
      <div className="flex items-center gap-4 mb-8">
        <AvatarSkeleton size="md" withText animation={animation} />
        <SkeletonBase className="h-4 w-24" animation={animation} />
      </div>
      
      {/* Featured image */}
      {hasImage && (
        <SkeletonBase 
          className="w-full aspect-video rounded-2xl mb-8" 
          animation={animation} 
        />
      )}
      
      {/* Content */}
      <div className="space-y-6">
        <TextSkeleton lines={4} animation={animation} />
        <TextSkeleton lines={3} animation={animation} />
        <TextSkeleton lines={4} animation={animation} />
      </div>
    </article>
  )
}

// ============================================================================
// 10. CommentSkeleton - For comment threads
// ============================================================================
interface CommentSkeletonProps extends BaseSkeletonProps {
  count?: number
  hasReplies?: boolean
}

export function CommentSkeleton({
  count = 3,
  hasReplies = false,
  className = '',
  animation = 'wave',
}: CommentSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="flex gap-3">
            <SkeletonBase className="w-10 h-10 rounded-full shrink-0" animation={animation} />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <SkeletonBase className="h-4 w-28" animation={animation} />
                <SkeletonBase className="h-3 w-16" animation={animation} />
              </div>
              <TextSkeleton lines={2} lastLineWidth="80%" animation={animation} />
              <div className="flex gap-4">
                <SkeletonBase className="h-4 w-12" animation={animation} />
                <SkeletonBase className="h-4 w-12" animation={animation} />
              </div>
            </div>
          </div>
          
          {/* Replies */}
          {hasReplies && i === 0 && (
            <div className="ml-12 pl-4 border-l border-white/10 space-y-3">
              <div className="flex gap-3">
                <SkeletonBase className="w-8 h-8 rounded-full shrink-0" animation={animation} />
                <div className="flex-1 space-y-2">
                  <SkeletonBase className="h-4 w-24" animation={animation} />
                  <SkeletonBase className="h-3 w-full max-w-xs" animation={animation} />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Demo Component for Showcase
// ============================================================================
export function SkeletonsDemo() {
  const [animationType, setAnimationType] = useState<AnimationType>('wave')

  return (
    <div className="space-y-12">
      {/* Animation toggle */}
      <div className="flex justify-center gap-2">
        {(['wave', 'pulse', 'none'] as AnimationType[]).map((type) => (
          <button
            key={type}
            onClick={() => setAnimationType(type)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
              ${animationType === type 
                ? 'bg-[var(--color-primary)] text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Skeleton */}
        <div>
          <p className="text-sm text-white/50 mb-3 font-medium">Card Skeleton</p>
          <CardSkeleton hasAvatar hasActions animation={animationType} />
        </div>

        {/* List Items */}
        <div>
          <p className="text-sm text-white/50 mb-3 font-medium">List Items</p>
          <ListItemSkeleton count={3} hasActions animation={animationType} />
        </div>

        {/* Profile */}
        <div>
          <p className="text-sm text-white/50 mb-3 font-medium">Profile</p>
          <ProfileSkeleton animation={animationType} />
        </div>

        {/* Table */}
        <div>
          <p className="text-sm text-white/50 mb-3 font-medium">Table</p>
          <TableSkeleton rows={4} columns={3} animation={animationType} />
        </div>

        {/* Media Grid */}
        <div>
          <p className="text-sm text-white/50 mb-3 font-medium">Media Grid</p>
          <MediaGridSkeleton items={6} columns={3} animation={animationType} />
        </div>

        {/* Form */}
        <div>
          <p className="text-sm text-white/50 mb-3 font-medium">Form</p>
          <FormSkeleton fields={3} animation={animationType} />
        </div>

        {/* Comments */}
        <div className="md:col-span-2">
          <p className="text-sm text-white/50 mb-3 font-medium">Comments</p>
          <CommentSkeleton count={2} hasReplies animation={animationType} />
        </div>
      </div>
    </div>
  )
}

// Export all
export const Skeletons = {
  SkeletonBase,
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  ListItemSkeleton,
  TableSkeleton,
  FormSkeleton,
  ProfileSkeleton,
  MediaGridSkeleton,
  ArticleSkeleton,
  CommentSkeleton,
  SkeletonsDemo,
}
