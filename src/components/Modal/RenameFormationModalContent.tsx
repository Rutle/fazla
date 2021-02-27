/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormationAction, formationAction } from '_/reducers/slices/formationGridSlice';
import { RootState } from '_/reducers/rootReducer';
import RButton from '../RButton/RButton';
import { CloseIcon } from '../Icons';

interface FormModalProps {
  setModalOpen: (openProp: { modal: string; isOpen: boolean }) => void;
}

const RenameFormationModalContent: React.FC<FormModalProps> = ({ setModalOpen }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const [nameVal, setNameVal] = useState('');
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <>
      <div className="modal-title">Rename formation</div>
      <div className="modal-content">
        <div>
          <div id="input-group" className={`${config.themeColor} ${inputFocus ? 'input-focus' : ''}`}>
            <input
              id="name-input"
              autoFocus
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
                  dispatch(formationAction(FormationAction.Rename, { formationName: nameVal }));
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
      </div>

      <div className="modal-action">
        <div className={`button-group full-width ${config.themeColor}`}>
          <RButton
            themeColor={config.themeColor}
            onClick={() => {
              dispatch(formationAction(FormationAction.Rename, { formationName: nameVal }));
              setModalOpen({ modal: '', isOpen: false });
            }}
          >
            Rename
          </RButton>
          <RButton themeColor={config.themeColor} onClick={() => setModalOpen({ modal: '', isOpen: false })}>
            Cancel
          </RButton>
        </div>
      </div>
    </>
  );
};

export default RenameFormationModalContent;
