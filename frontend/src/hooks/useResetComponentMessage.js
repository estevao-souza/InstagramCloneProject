export const useResetComponentMessage = (dispatch, resetMethod) => {
  return () => {
    setTimeout(() => {
      dispatch(resetMethod())
    }, 3000)
  }
}
