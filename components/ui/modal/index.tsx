import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal"
import { useEffect, useMemo } from "react";

export default function EasModal({ isDialog, size, _open, _close, children }: any) {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const sizeMap = {
    xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl",
    "2xl": "2xl", "3xl": "3xl", "4xl": "4xl", "5xl": "5xl", "full": "full",
  } as const;
  type SizeType = typeof sizeMap[keyof typeof sizeMap];
  function getSize(status: string): SizeType | "xl" {
    return sizeMap[status as keyof typeof sizeMap] || "xl";
  }

  const isShow = useMemo(() => {
    return isDialog;
  }, [isDialog]);
  
  useEffect(() => {
    if (isShow) {
      handleOpen()
    }
  }, [isShow]);
  
  useEffect(() => {
    if (!isShow && !isOpen) {
      handleClose()
    }
  }, [isOpen]);

  const handleOpen = () => {
    onOpen()
    _open()
  }
  
  const handleClose = () => {
    onClose()
    _close()
  }

  return (
    <>
      <Modal isOpen={isOpen} size={getSize(size)} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Header</ModalHeader>
              <ModalBody>
                {children}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>Action</Button>
                <Button color="danger" variant="light" onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}