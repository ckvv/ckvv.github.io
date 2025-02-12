import { useState } from 'react';

export default function RButton(props) {
  const [count, setCount] = useState(props.count || 0);

  function handleClick() {
    setCount(count + 1);
  }
  return (
    <button
      className="v-button text-sky-500 bg-sky-200 px-2 py-1 whitespace-nowrap rounded-lg"
      onClick={handleClick}
    >
      { props.children }
      {count}
    </button>
  );
}
