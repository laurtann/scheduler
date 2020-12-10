import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  let [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    if (replace) {
      setHistory(prev => [...prev.slice(0, prev.length -1), mode]);
    } else {
      setHistory(prev => [...prev, mode])
    }
    setMode(mode);
  }

  function back() {
    if (history.length > 1) {
      // lifecycle hasn't caught up yet, so history has changed but mode still thinks
      // the item we just sliced is there
      setHistory(prev => [...prev.slice(0, prev.length -1)]);
      setMode(history[history.length - 2]);
    }
  }

  return { mode, transition, back };
};
