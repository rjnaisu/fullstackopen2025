import { useCounterControls } from "../counter"

const Buttons = () => {
  const { good, bad, neutral } = useCounterControls(state => state.actions)

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={good}>good</button>
      <button onClick={neutral}>neutral</button>
      <button onClick={bad}>bad</button>
    </div>
  )
}

export default Buttons
