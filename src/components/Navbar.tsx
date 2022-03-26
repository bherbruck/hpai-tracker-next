import {
  InformationCircleIcon,
  BellIcon,
  ChartBarIcon,
} from '@heroicons/react/outline'

type NavbarProps = {
  title?: string
  onStatsClick?: () => void
  onAboutClick?: () => void
  onSubscribeClick?: () => void
  onBmacClick?: () => void
}

export const Navbar = (props: NavbarProps) => {
  return (
    <div className="navbar w-auto bg-base-100 backdrop-blur absolute top-2 left-2 right-2 rounded-box z-[10000]">
      <div className="navbar-start">
        <div className="btn btn-ghost btn-disabled normal-case text-xl">
          {props.title ?? 'HPAI Tracker'}
        </div>
      </div>
      <div className="navbar-center" />

      <div className="navbar-end flex flex-row">
        {/* stats button */}
        <button
          className="btn btn-ghost gap-1"
          onClick={props.onStatsClick}
          aria-label="Stats"
        >
          <ChartBarIcon className="h-6 w-6" />
          <span className="hidden md:block">Stats</span>
        </button>

        {/* about button */}
        <button
          className="btn btn-ghost gap-1"
          onClick={props.onAboutClick}
          aria-label="About"
        >
          <InformationCircleIcon className="h-6 w-6" />
          <span className="hidden md:block">About</span>
        </button>

        {/* subscribe button */}
        <button
          className="btn btn-ghost gap-1"
          onClick={props.onSubscribeClick}
          aria-label="Subscribe"
        >
          <BellIcon className="h-6 w-6" />
          <span className="hidden md:block">Subscribe</span>
        </button>
      </div>
    </div>
  )
}
