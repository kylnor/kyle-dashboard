interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </header>
  )
}
