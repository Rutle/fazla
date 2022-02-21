import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
import { FormationAction, formationAction } from '_/reducers/slices/formationGridSlice';
import { AppContext } from '_/App';
import RButton from '../RButton/RButton';
import RToggle from '../RToggle/RToggle';
import { CloseIcon } from '../Icons';

interface FormModalProps {
  setModalOpen: (openProp: { modal: string; isOpen: boolean }) => void;
}
const NewFormationModalContent: React.FC<FormModalProps> = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  const { addToast } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const [nameVal, setNameVal] = useState('');
  const [typeVal, setTypeVal] = useState('normal');
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <>
      <div className="modal-title">Create new formation</div>
      <div className="modal-content">
        <div>
          <div id="input-group" className={`${config.themeColor} ${inputFocus ? 'input-focus' : ''}`}>
            <input
              id="name-input"
              type="text"
              spellCheck="false"
              className={`${config.themeColor}`}
              placeholder="Formation name"
              value={nameVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNameVal(e.target.value);
              }}
              onFocus={(e) => {
                setInputFocus(true);
                e.target.select();
              }}
              onBlur={() => setInputFocus(false)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  dispatch(
                    formationAction(
                      FormationAction.New,
                      {
                        formationName: nameVal,
                        formationType: typeVal,
                      },
                      addToast
                    )
                  );
                  setModalOpen({ modal: '', isOpen: false });
                }
              }}
            />
            {nameVal.length > 0 ? (
              <RButton
                themeColor={config.themeColor}
                className="btn input"
                onClick={() => {
                  setNameVal('');
                }}
              >
                <CloseIcon themeColor={config.themeColor} className="icon" />
              </RButton>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px', justifyContent: 'center' }}>
          <div className={`radio-group rounded ${config.themeColor}`}>
            <RToggle
              id="normal-toggle"
              value="normal"
              className="btn normal"
              themeColor={config.themeColor}
              onChange={() => setTypeVal('normal')}
              selected={typeVal === 'normal'}
            >
              Normal
            </RToggle>
            <RToggle
              id="siren-toggle"
              value="siren"
              className="btn normal"
              themeColor={config.themeColor}
              onChange={() => setTypeVal('siren')}
              selected={typeVal === 'siren'}
            >
              Siren
            </RToggle>
          </div>
        </div>
      </div>

      <div className="modal-action">
        <div className={`button-group rounded full-width ${config.themeColor}`}>
          <RButton
            themeColor={config.themeColor}
            onClick={() => {
              dispatch(
                formationAction(
                  FormationAction.New,
                  {
                    formationName: nameVal,
                    formationType: typeVal,
                  },
                  addToast
                )
              );
              setModalOpen({ modal: '', isOpen: false });
            }}
          >
            Create
          </RButton>
          <RButton themeColor={config.themeColor} onClick={() => setModalOpen({ modal: '', isOpen: false })}>
            Cancel
          </RButton>
        </div>
      </div>
    </>
  );
};

export default NewFormationModalContent;
