import { addNewSectionList } from "@/types/main/newSec/addNewSec";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Plus } from "lucide-react";
import { ModalSec } from "./modalSec";

export const AddSection = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        className="flex bg-gray4 border-2 border-gray3 flex-col w-[10rem] h-[8rem] text-2xl rounded-4xl"
      >
        <Plus />
        <span>بخش جدید</span>
      </Button>
      <Modal
        isOpen={isOpen}
        className="rounded-4xl"
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                بخش جدید
              </ModalHeader>
              <ModalBody>
                <ul className="flex flex-wrap justify-center gap-4 items-center">
                  {addNewSectionList.map((sec, i) => (
                    <ModalSec {...sec} key={i} />
                  ))}
                </ul>
              </ModalBody>
              <ModalFooter className="text-center justify-center text-gray">
                <p>برای اضافه کردن هر بخش ، فقط کافیه روی آن کلیک کنید.</p>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
