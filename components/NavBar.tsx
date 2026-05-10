'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, Settings } from 'lucide-react'

const links = [
  { href: '/', label: 'Pedido', icon: Home },
  { href: '/historico', label: 'Histórico', icon: ClipboardList },
  { href: '/admin', label: 'Admin', icon: Settings },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 flex z-50">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center flex-1 py-2 min-h-[65px] transition-colors ${
              active ? 'text-brand bg-orange-50' : 'text-gray-500 hover:text-brand'
            }`}
          >
            <Icon size={25} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[13px] font-semibold mt-1">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
