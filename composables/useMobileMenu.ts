export const useMobileMenu = () => {
  const isOpen = useState<boolean>('mobile-menu-open', () => false)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const close = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    toggle,
    close
  }
}
