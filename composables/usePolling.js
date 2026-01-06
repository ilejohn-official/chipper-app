export function usePolling(callback, interval = 30000) {
  let pollInterval = null
  let isVisible = true

  const handleVisibilityChange = () => {
    isVisible = !document.hidden
    if (isVisible && !pollInterval) {
      start()
    } else if (!isVisible && pollInterval) {
      stop()
    }
  }

  function start() {
    if (pollInterval) return

    pollInterval = setInterval(() => {
      if (isVisible) {
        callback()
      }
    }, interval)
  }

  function stop() {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    start()
  })

  onBeforeUnmount(() => {
    stop()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return {
    start,
    stop
  }
}
