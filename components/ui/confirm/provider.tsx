'use client';

import { createContext, useContext, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button'

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolvePromise, setResolvePromise] = useState<(val: boolean) => void>(() => () => {});

  const confirm: ConfirmContextType = (opts) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Modal isOpen={isOpen} onClose={handleCancel} hideCloseButton>
        <ModalContent>
          <ModalHeader>{options.title || 'Баталгаажуулах'}</ModalHeader>
          <ModalBody>
            <p>{options.description || 'Та үйлдэлээ үргэлжлүүлэхдээ итгэлтэй байна уу?'}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleConfirm}>
              {options.confirmText || 'Баталгаажуулах'}
            </Button>
            <Button variant="flat" onPress={handleCancel}>
              {options.cancelText || 'Болих'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ConfirmContext.Provider>
  );
};
