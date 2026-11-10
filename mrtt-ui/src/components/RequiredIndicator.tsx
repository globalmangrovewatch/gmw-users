import language from '@/language'

function RequiredIndicator() {
  return (
    <span aria-label={language.form.requiredIndicator} className='px-1.25 text-danger'>
      *
    </span>
  )
}

export default RequiredIndicator
