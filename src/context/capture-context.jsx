import React, { useState } from 'react';

const CaptureContext = React.createContext();

 
export function CaptureContextProvider({ children }) {
  const [playedSecond, setPlayedSecond] = React.useState(0);
  const [clickedPlayedSecond, setClickedPlayedSecond] = React.useState(0);
  const [checkId, setChecId] = useState(null);

  const updatePlayedSecond = (newSecond) => {
    setPlayedSecond(newSecond);
  };

  const updateClickPlayedSecond = (newSecond) => {
    setClickedPlayedSecond(newSecond);
  };

  const updateCheckId = (val) => {
    setChecId(val);
  };

  return (
    <CaptureContext.Provider
      value={{
        playedSecond,
        setPlayedSecond: updatePlayedSecond,
        clickedPlayedSecond,
        setClickedPlayedSecond: updateClickPlayedSecond,
        checkId,
        setChecId: updateCheckId,
      }}
    >
      {children}
    </CaptureContext.Provider>
  );
}

export function useCaptureContext() {
  const context = React.useContext(CaptureContext);

  if (context === undefined) {
    throw new Error('useCaptureContext can only be used inside CaptureProvider');
  }

  return context;
}
