import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <input value="3" id="num" type="number" placeholder="请输入并发数量" />
      <div id="content" className="content"></div>
      <button>开始</button>
    </div>
  );
}

export default App;
