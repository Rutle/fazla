import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { encodeFormation, parseImportCode } from '_/utils/appUtilities';
import { RootState } from '_/reducers/rootReducer';
import { FormationAction, formationAction } from '_/reducers/slices/formationGridSlice';
import { CloseIcon } from '_components/Icons';
import { Formation } from '_/types/types';
import RButton from '../RButton/RButton';

interface FormModalProps {
  setModalOpen: (openProp: { modal: string; isOpen: boolean }) => void;
  isType: string;
}
const ImportExportModalContent: React.FC<FormModalProps> = ({ setModalOpen, isType }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const fGrid = useSelector((state: RootState) => state.formationGrid);
  const [value, setValue] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const [isValidCode, setIsValidCode] = useState(true);
  const [importedFormation, setImportedFormation] = useState<Formation>({ data: [], equipment: [], name: '' });
  const [copySuccess, setCopySuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getTitle = () => {
    if (isType === 'export') return 'Export formation';
    if (isType === 'import') return 'Import formation';
    return '';
  };

  useEffect(() => {
    if (isType === 'export') {
      const encURI = encodeURIComponent(encodeFormation(fGrid.formations[fGrid.selectedIndex]));
      const urlList = window.location.href.split('/');
      const linkURL = urlList.slice(0, -1).concat('link').join('/');
      setValue(`${linkURL}/${encURI}`);
    }
  }, [fGrid.formations, fGrid.selectedIndex, isType]);

  const copyCode = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      inputRef.current.focus();
      setCopySuccess(true);
    }
  };

  return (
    <>
      <div className="modal-title">{getTitle()}</div>
      <div className="modal-content">
        <div>
          <div
            id="input-group"
            className={`${config.themeColor} ${inputFocus ? 'input-focus' : ''} ${
              !isValidCode && value.length !== 0 ? 'is-invalid' : ''
            }`}
          >
            {isType === 'import' ? (
              <input
                id="code-input"
                type="text"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                spellCheck="false"
                className={`${config.themeColor}`}
                placeholder="Input import code"
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setValue(e.target.value);
                  const result = parseImportCode(e.target.value);
                  if (result) {
                    setImportedFormation(result as Formation);
                    setIsValidCode(true);
                  } else {
                    setImportedFormation({ data: [], equipment: [], name: '' });
                    setIsValidCode(false);
                  }
                }}
                onFocus={(e) => {
                  setInputFocus(true);
                  e.target.select();
                }}
                onBlur={() => setInputFocus(false)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    dispatch(formationAction(FormationAction.Import, { importedFormation }));
                    setModalOpen({ modal: '', isOpen: false });
                  }
                }}
              />
            ) : (
              <input
                ref={inputRef}
                id="code-input"
                type="text"
                spellCheck="false"
                className={`${config.themeColor}`}
                placeholder=""
                value={value}
                readOnly
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    document.execCommand('copy');
                    setModalOpen({ modal: '', isOpen: false });
                  }
                }}
              />
            )}

            {value.length > 0 ? (
              <RButton
                themeColor={config.themeColor}
                className="btn input"
                onClick={() => {
                  setValue('');
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
        <div className={`button-group rounded full-width ${config.themeColor}`}>
          {isType === 'import' ? (
            <>
              <RButton
                disabled={!isValidCode || value.length === 0}
                themeColor={config.themeColor}
                onClick={() => {
                  dispatch(formationAction(FormationAction.Import, { importedFormation }));
                  setModalOpen({ modal: '', isOpen: false });
                }}
              >
                Import
              </RButton>
              <RButton themeColor={config.themeColor} onClick={() => setModalOpen({ modal: '', isOpen: false })}>
                Cancel
              </RButton>
            </>
          ) : (
            <RButton
              themeColor={config.themeColor}
              onClick={() => {
                copyCode();
              }}
            >
              {!copySuccess ? 'Copy to clipboard' : 'Copied successfully.'}
            </RButton>
          )}
        </div>
      </div>
    </>
  );
};

export default ImportExportModalContent;
