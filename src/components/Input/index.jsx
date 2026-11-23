import './style.css'

const Input = ({label,state,setState,placeholder,type}) => {
  return (
    <div className='input-Wrapper'>
        <p className='label-input'>{label}</p>
        <input  className='custom-input' placeholder={placeholder}
        type={type}
        value={state} onChange={(e)=>setState(e.target.value)} />

    </div>
  )
}

export default Input
