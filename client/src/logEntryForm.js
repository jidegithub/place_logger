import React , {useState} from 'react'
import { useForm } from 'react-hook-form';
import { createLogEntries } from './API'

export default function LogEntryForm({ location, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      data.latitude = location.latitude;
      data.longitude = location.longitude
      const created = await createLogEntries(data);
      console.log(created);
      onClose()
    } catch (error) {
      console.log(error)
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Add your new log entry here</h3>
        {error ? <h3 className= "has-error">{error}</h3>: null}
        <div className="form-group">
          <input type="text" required name="title" ref={register} />
          <label htmlFor="title" className="control-label">name</label><i className="bar"></i>
        </div>

        <div className="form-group">
          <textarea name="comment" ref={register}></textarea>
          <label htmlFor="comment" className="control-label">comment</label><i className="bar"></i>
        </div>

        <div className="form-group">
          <textarea name="description" ref={register}></textarea>
          <label htmlFor="description" className="control-label">description</label><i className="bar"></i>
        </div>

        <div className="form-group">
          <input type="text" name="image" ref={register} />
          <label htmlFor="image" className="control-label">image url</label><i className="bar"></i>
        </div>

        <div className="form-group">
          <input type="date" required name="visitDate" ref={register} />
          <label htmlFor="visitDate" className="control-label">visit date</label><i className="bar"></i>
        </div>

        <div className="button-container">
        <button disabled={loading} className="button"><span>{loading ? "loading..." : "Create Entry"}</span></button>
        </div>
      </form>
    </div>
  )
}
