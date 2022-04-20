import React from 'react'
import styles from './style.module.scss'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import TextField from '@mui/material/Input'

function ProjectDetailsForm(): JSX.Element {
  // form validation rules
  const validationSchema = Yup.object().shape({
    projectTitle: Yup.string().required('Project title is required'),
    projectAims: Yup.array().of(Yup.string()).typeError('Select at least one item'),
    projectDuration: Yup.number().required('Number is required').typeError('Must be a number')
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { register, control, handleSubmit, watch, formState } = useForm(formOptions)
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
        <TextField required id="outlined-required" defaultValue="Hello World" />
        {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              required
              // id="outlined-required"
              // label="Required"
              // variant="outlined"
              id="outlined-basic"
              defaultValue="Hello World"
              {...field}
            />
          )}
        />

        <div className={styles.formGroup}>
          <label>What is the overall aim for the project area?</label>
          {options.map((value) => (
            <label key={value}>
              <input
                key={value}
                type="checkbox"
                value={value}
                {...register('projectAims', { required: true })}
              />
              {value}
            </label>
          ))}
          <div className={styles.invalid}>{errors.projectAims?.message}</div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Project duration</label>
            <input
              defaultValue={0}
              type="text"
              {...register('projectDuration', { required: true })}
            />
            <div className={styles.invalid}>{errors.projectDuration?.message}</div>
            <label className={styles.label}>Period</label>
            <input
              defaultValue="month(s)"
              type="text"
              {...register('projectDurationUnit', { required: true })}
            />
          </div>
        </div>

        <input type="submit" />
      </form>
    </div>
  )
}

export default ProjectDetailsForm
