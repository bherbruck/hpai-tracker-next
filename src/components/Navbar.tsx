import { InformationCircleIcon, BellIcon } from '@heroicons/react/outline'

type NavbarProps = {
  title?: string
  onAboutClick?: () => void
  onSubscribeClick?: () => void
  onBmacClick?: () => void
}

export const Navbar = (props: NavbarProps) => {
  return (
    <div className="navbar w-auto bg-base-100 backdrop-blur absolute top-2 left-2 right-2 rounded-box z-[10000]">
      <div className="navbar-start">
        <button className="btn btn-ghost btn-disabled normal-case text-xl">
          {props.title ?? 'HPAI Tracker'}
        </button>
      </div>
      <div className="navbar-center" />

      {/* about button */}
      <div className="navbar-end flex flex-row">
        <button className="btn btn-ghost gap-1" onClick={props.onAboutClick}>
          <InformationCircleIcon className="h-6 w-6" />
          <span className="hidden md:block">About</span>
        </button>

        {/* subscribe button */}
        <button
          className="btn btn-ghost gap-1"
          onClick={props.onSubscribeClick}
        >
          <BellIcon className="h-6 w-6" />
          <span className="hidden md:block">Subscribe</span>
        </button>
      </div>
    </div>
  )
}
