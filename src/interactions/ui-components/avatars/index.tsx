import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

// Types
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type StatusType = 'online' | 'away' | 'busy' | 'offline'

const sizeClasses: Record<AvatarSize, { container: string; text: string; status: string; statusRing: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]', status: 'w-2 h-2', statusRing: 'ring-1' },
  sm: { container: 'w-8 h-8', text: 'text-xs', status: 'w-2.5 h-2.5', statusRing: 'ring-2' },
  md: { container: 'w-10 h-10', text: 'text-sm', status: 'w-3 h-3', statusRing: 'ring-2' },
  lg: { container: 'w-12 h-12', text: 'text-base', status: 'w-3.5 h-3.5', statusRing: 'ring-2' },
  xl: { container: 'w-16 h-16', text: 'text-lg', status: 'w-4 h-4', statusRing: 'ring-[3px]' },
}

const statusColors: Record<StatusType, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
  offline: 'bg-neutral-500',
}

// Helper to generate initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Helper to generate consistent color from name
function getColorFromName(name: string): string {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-600',
    'from-amber-500 to-orange-500',
    'from-cyan-500 to-blue-500',
  ]
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[index % colors.length]
}

// ============================================================================
// 1. Basic Avatar - Image with fallback initials
// ============================================================================
interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  status?: StatusType
  bordered?: boolean
  className?: string
  onClick?: () => void
}

export function Avatar({
  src,
  name,
  size = 'md',
  status,
  bordered = false,
  className = '',
  onClick,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const sizeConfig = sizeClasses[size]
  const initials = getInitials(name)
  const gradientColor = useMemo(() => getColorFromName(name), [name])
  const prefersReducedMotion = useReducedMotion()

  const showImage = src && !imageError

  return (
    <motion.div
      whileHover={onClick && !prefersReducedMotion ? { scale: 1.05 } : undefined}
      whileTap={onClick && !prefersReducedMotion ? { scale: 0.95 } : undefined}
      className={`
        relative inline-flex items-center justify-center shrink-0
        ${sizeConfig.container}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={name}
    >
      {/* Avatar content */}
      <div
        className={`
          w-full h-full rounded-full overflow-hidden
          flex items-center justify-center
          ${bordered ? 'ring-2 ring-white/20' : ''}
          ${showImage ? 'bg-neutral-800' : `bg-gradient-to-br ${gradientColor}`}
        `}
      >
        {showImage ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={`font-semibold text-white ${sizeConfig.text}`}>
            {initials}
          </span>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${sizeConfig.status} ${sizeConfig.statusRing}
            ${statusColors[status]}
            rounded-full ring-neutral-900
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </motion.div>
  )
}

// ============================================================================
// 2. Avatar Group - Stacked avatars
// ============================================================================
interface AvatarGroupProps {
  users: Array<{ src?: string; name: string; status?: StatusType }>
  size?: AvatarSize
  max?: number
  bordered?: boolean
  className?: string
  onUserClick?: (index: number) => void
  onMoreClick?: () => void
}

export function AvatarGroup({
  users,
  size = 'md',
  max = 4,
  bordered = true,
  className = '',
  onUserClick,
  onMoreClick,
}: AvatarGroupProps) {
  const prefersReducedMotion = useReducedMotion()
  const visibleUsers = users.slice(0, max)
  const remainingCount = users.length - max

  const overlapClass: Record<AvatarSize, string> = {
    xs: '-ml-2',
    sm: '-ml-2.5',
    md: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-5',
  }

  const sizeConfig = sizeClasses[size]

  return (
    <div className={`flex items-center ${className}`}>
      {visibleUsers.map((user, index) => (
        <motion.div
          key={index}
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={index > 0 ? overlapClass[size] : ''}
          style={{ zIndex: visibleUsers.length - index }}
        >
          <Avatar
            src={user.src}
            name={user.name}
            size={size}
            status={user.status}
            bordered={bordered}
            onClick={onUserClick ? () => onUserClick(index) : undefined}
          />
        </motion.div>
      ))}
      
      {remainingCount > 0 && (
        <motion.button
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          transition={{ delay: visibleUsers.length * 0.05 }}
          onClick={onMoreClick}
          className={`
            ${overlapClass[size]}
            ${sizeConfig.container}
            rounded-full
            bg-neutral-800 border-2 border-neutral-900
            flex items-center justify-center
            hover:bg-neutral-700 transition-colors
            ${sizeConfig.text} font-medium text-white/80
          `}
          style={{ zIndex: 0 }}
          aria-label={`${remainingCount} more users`}
        >
          +{remainingCount}
        </motion.button>
      )}
    </div>
  )
}

// ============================================================================
// 3. Avatar with Badge - Notification count
// ============================================================================
interface AvatarWithBadgeProps extends AvatarProps {
  badgeCount?: number
  badgeColor?: string
}

export function AvatarWithBadge({
  badgeCount,
  badgeColor = 'bg-red-500',
  ...avatarProps
}: AvatarWithBadgeProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="relative inline-flex">
      <Avatar {...avatarProps} />
      
      <AnimatePresence>
        {badgeCount !== undefined && badgeCount > 0 && (
          <motion.span
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0 }}
            className={`
              absolute -top-1 -right-1
              min-w-[18px] h-[18px] px-1
              ${badgeColor}
              rounded-full flex items-center justify-center
              text-[10px] font-bold text-white
              ring-2 ring-neutral-900
            `}
          >
            {badgeCount > 99 ? '99+' : badgeCount}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 4. Avatar with Name - Avatar + text label
// ============================================================================
interface AvatarWithNameProps extends AvatarProps {
  subtitle?: string
  direction?: 'horizontal' | 'vertical'
}

export function AvatarWithName({
  subtitle,
  direction = 'horizontal',
  ...avatarProps
}: AvatarWithNameProps) {
  const isVertical = direction === 'vertical'

  return (
    <div
      className={`
        inline-flex items-center gap-3
        ${isVertical ? 'flex-col text-center' : ''}
      `}
    >
      <Avatar {...avatarProps} />
      <div className={isVertical ? 'mt-1' : ''}>
        <p className="font-medium text-white text-sm">{avatarProps.name}</p>
        {subtitle && (
          <p className="text-white/50 text-xs">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// 5. Interactive Avatar - With hover card
// ============================================================================
interface InteractiveAvatarProps extends AvatarProps {
  email?: string
  role?: string
  onMessage?: () => void
  onViewProfile?: () => void
}

export function InteractiveAvatar({
  email,
  role,
  onMessage,
  onViewProfile,
  ...avatarProps
}: InteractiveAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar {...avatarProps} />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="
              absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50
              w-56 p-4
              backdrop-blur-xl bg-neutral-900/95 border border-white/10
              shadow-[0_10px_40px_rgba(0,0,0,0.5)]
              rounded-xl
            "
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar {...avatarProps} size="lg" />
              <div>
                <p className="font-semibold text-white">{avatarProps.name}</p>
                {role && <p className="text-xs text-white/50">{role}</p>}
              </div>
            </div>
            
            {email && (
              <p className="text-xs text-white/60 mb-3 truncate">{email}</p>
            )}
            
            <div className="flex gap-2">
              {onMessage && (
                <button
                  onClick={onMessage}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                >
                  Message
                </button>
              )}
              {onViewProfile && (
                <button
                  onClick={onViewProfile}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Profile
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 6. Editable Avatar - With edit overlay
// ============================================================================
interface EditableAvatarProps extends Omit<AvatarProps, 'onClick'> {
  onEdit?: () => void
}

export function EditableAvatar({
  onEdit,
  size = 'xl',
  ...avatarProps
}: EditableAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const sizeConfig = sizeClasses[size]

  return (
    <div
      className={`
        relative inline-flex ${sizeConfig.container}
        cursor-pointer group
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onEdit}
      role="button"
      tabIndex={0}
      aria-label={`Edit ${avatarProps.name}'s avatar`}
    >
      <Avatar {...avatarProps} size={size} />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            className="
              absolute inset-0 rounded-full
              bg-black/60 backdrop-blur-sm
              flex items-center justify-center
            "
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Demo Component for Showcase
// ============================================================================
export function AvatarsDemo() {
  const users = [
    { name: 'John Doe', src: 'https://i.pravatar.cc/150?img=1', status: 'online' as StatusType },
    { name: 'Jane Smith', src: 'https://i.pravatar.cc/150?img=2', status: 'away' as StatusType },
    { name: 'Bob Johnson', src: 'https://i.pravatar.cc/150?img=3', status: 'busy' as StatusType },
    { name: 'Alice Brown', status: 'offline' as StatusType },
    { name: 'Charlie Davis', src: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Eva Wilson', src: 'https://i.pravatar.cc/150?img=6' },
    { name: 'Frank Miller' },
  ]

  return (
    <div className="space-y-10 flex flex-col items-center">
      {/* Sizes */}
      <div>
        <p className="text-sm text-white/50 mb-4 text-center">Sizes</p>
        <div className="flex items-end gap-4">
          <Avatar name="XS Size" size="xs" />
          <Avatar name="SM Size" size="sm" />
          <Avatar name="MD Size" size="md" />
          <Avatar name="LG Size" size="lg" />
          <Avatar name="XL Size" size="xl" />
        </div>
      </div>

      {/* With Status */}
      <div>
        <p className="text-sm text-white/50 mb-4 text-center">Status Indicators</p>
        <div className="flex items-center gap-4">
          <Avatar name="Online" src="https://i.pravatar.cc/150?img=1" status="online" size="lg" />
          <Avatar name="Away" src="https://i.pravatar.cc/150?img=2" status="away" size="lg" />
          <Avatar name="Busy" src="https://i.pravatar.cc/150?img=3" status="busy" size="lg" />
          <Avatar name="Offline" src="https://i.pravatar.cc/150?img=4" status="offline" size="lg" />
        </div>
      </div>

      {/* Bordered */}
      <div>
        <p className="text-sm text-white/50 mb-4 text-center">Bordered & Fallback Initials</p>
        <div className="flex items-center gap-4">
          <Avatar name="Sarah Connor" bordered size="lg" />
          <Avatar name="John Wick" bordered size="lg" />
          <Avatar name="Bruce Wayne" bordered size="lg" />
        </div>
      </div>

      {/* Avatar Group */}
      <div>
        <p className="text-sm text-white/50 mb-4 text-center">Avatar Group</p>
        <AvatarGroup users={users} size="md" max={4} />
      </div>

      {/* With Badge */}
      <div>
        <p className="text-sm text-white/50 mb-4 text-center">With Badge</p>
        <div className="flex items-center gap-6">
          <AvatarWithBadge name="Notifications" src="https://i.pravatar.cc/150?img=7" badgeCount={3} size="lg" />
          <AvatarWithBadge name="Messages" src="https://i.pravatar.cc/150?img=8" badgeCount={99} size="lg" />
          <AvatarWithBadge name="Updates" badgeCount={150} size="lg" />
        </div>
      </div>

      {/* With Name */}
      <div>
        <p className="text-sm text-white/50 mb-4 text-center">With Name & Subtitle</p>
        <div className="flex items-center gap-8">
          <AvatarWithName
            name="Sarah Johnson"
            subtitle="Product Designer"
            src="https://i.pravatar.cc/150?img=9"
            status="online"
            size="md"
          />
          <AvatarWithName
            name="Alex Chen"
            subtitle="Engineering Lead"
            src="https://i.pravatar.cc/150?img=10"
            status="away"
            size="md"
            direction="vertical"
          />
        </div>
      </div>

      {/* Interactive */}
      <div>
        <p className="text-sm text-white/50 mb-4 text-center">Interactive (hover)</p>
        <InteractiveAvatar
          name="Emily Parker"
          src="https://i.pravatar.cc/150?img=11"
          size="lg"
          status="online"
          email="emily@example.com"
          role="Senior Developer"
          onMessage={() => console.log('Message clicked')}
          onViewProfile={() => console.log('Profile clicked')}
        />
      </div>

      {/* Editable */}
      <div>
        <p className="text-sm text-white/50 mb-4 text-center">Editable (hover)</p>
        <EditableAvatar
          name="Your Avatar"
          src="https://i.pravatar.cc/150?img=12"
          size="xl"
          onEdit={() => console.log('Edit clicked')}
        />
      </div>
    </div>
  )
}

// Export all
export const Avatars = {
  Avatar,
  AvatarGroup,
  AvatarWithBadge,
  AvatarWithName,
  InteractiveAvatar,
  EditableAvatar,
  AvatarsDemo,
}
