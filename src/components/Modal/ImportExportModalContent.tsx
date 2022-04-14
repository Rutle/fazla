import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { encodeFormation, parseImportCode } from '_/utils/appUtilities';
import { RootState } from '_/reducers/rootReducer';
import { FormationAction, formationAction } from '_/reducers/slices/formationGridSlice';
import { CloseIcon } from '_components/Icons';
import { Formation } from '_/types/types';
import RButton from '../RButton/RButton';
import RToggle from '../RToggle/RToggle';

interface FormModalProps {
  setModalOpen: (openProp: { modal: string; isOpen: boolean }) => void;
  isType: string;
}
const ImportExportModalContent: React.FC<FormModalProps> = ({ setModalOpen, isType }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const fGrid = useSelector((state: RootState) => state.formationGrid);
  const [textValue, setValue] = useState({ url: '', code: '' });
  const [importValue, setImportValue] = useState('');
  const [typeValue, setTypeValue] = useState<'url' | 'code'>('url');
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
      const res = encodeFormation(fGrid.formations[fGrid.selectedIndex]);
      const encURI = encodeURIComponent(res);
      const urlList = window.location.href.split('/');
      const linkURL = urlList.slice(0, -1).concat('link').join('/');
      setValue({ url: `${linkURL}/${encURI}`, code: encURI });
    }
  }, [fGrid.formations, fGrid.selectedIndex, isType]);

  useEffect(() => {
    if (isType === 'import') {
      try {
        const decoded = decodeURIComponent(importValue);
        const result = parseImportCode(decoded);
        if (result) {
          setImportedFormation(result as Formation);
          setIsValidCode(true);
        } else {
          setImportedFormation({ data: [], equipment: [], name: '' });
          setIsValidCode(false);
        }
      } catch (err) {
        setImportedFormation({ data: [], equipment: [], name: '' });
        setIsValidCode(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importValue]);

  const copyCode = async () => {
    if (inputRef && inputRef.current) {
      inputRef.current.select();
      if (!navigator.clipboard) {
        // Fallback for old execCommand usage.
        document.execCommand('copy');
        inputRef.current.focus();
        setCopySuccess(true);
      } else {
        await navigator.clipboard.writeText(inputRef.current.value);
      }
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
              !isValidCode && importValue.length !== 0 ? 'is-invalid' : ''
            }`}
          >
            {isType === 'import' ? (
              <>
                <input
                  id="code-input"
                  type="text"
                  // TODO: Improve accessibility.
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  spellCheck="false"
                  className={`${config.themeColor}`}
                  placeholder="Input import code without url"
                  value={importValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setImportValue(e.target.value);
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

                {importValue.length > 0 ? (
                  <RButton
                    themeColor={config.themeColor}
                    className="btn input"
                    onClick={() => {
                      setImportValue('');
                    }}
                  >
                    <CloseIcon themeColor={config.themeColor} className="icon" />
                  </RButton>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <input
                ref={inputRef}
                id="code-input"
                type="text"
                spellCheck="false"
                className={`${config.themeColor}`}
                placeholder=""
                value={textValue[typeValue]}
                readOnly
                style={{ padding: '2px 6px 2px 6px' }}
              />
            )}
          </div>
        </div>
        {isType === 'export' ? (
          <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px', justifyContent: 'center' }}>
            <div className={`radio-group rounded ${config.themeColor}`}>
              <RToggle
                id="normal-toggle"
                value="normal"
                className="btn normal"
                themeColor={config.themeColor}
                onChange={() => setTypeValue('url')}
                selected={typeValue === 'url'}
              >
                Link
              </RToggle>
              <RToggle
                id="siren-toggle"
                value="siren"
                className="btn normal"
                themeColor={config.themeColor}
                onChange={() => setTypeValue('code')}
                selected={typeValue === 'code'}
              >
                Code
              </RToggle>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="modal-action">
        <div className={`button-group rounded full-width ${config.themeColor}`}>
          {isType === 'import' ? (
            <>
              <RButton
                disabled={!isValidCode || importValue.length === 0}
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
              onClick={async () => {
                await copyCode();
                setModalOpen({ modal: '', isOpen: false });
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
