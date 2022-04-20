import React from 'react'
import styles from './style.module.scss'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

function ProjectDetailsForm() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    projectTitle: Yup.string().required('Project title is required'),
    projectAims: Yup.string().required('Project aims are required')
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, watch, formState } = useForm(formOptions)
  const { errors } = formState

  const onSubmit = (data: any) => console.log('data: ', data)

  const options = ['Restoration/Rehabilitation', 'Afforestation', 'Protection', 'Other']

  return (
    <div className="project-details-form">
      <h1>Project Details Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project title</label>
          <input defaultValue="" type="text" {...register('projectTitle', { required: true })} />
          <div className={styles.invalid}>{errors.projectTitle?.message}</div>
        </div>
        <div className={styles.formGroup}>
          <label>What is the overall aim for the project area?</label>
          <input {...register('projectAims', { required: true })} />
          {errors.projectAims?.message && <span>This field is required</span>}
        </div>
        <input type="submit" />
      </form>
    </div>
  )
}

export default ProjectDetailsForm
