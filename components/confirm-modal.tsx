import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import React from "react";
import { Modal, Pressable } from "react-native";

export type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 px-5 justify-center"
        onPress={onCancel}
      >
        <Pressable
          className="bg-background-0 rounded-2xl border border-outline-200 overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          <Box className="px-5 py-4 gap-2">
            <Text size="xl" weight="extrabold" className="text-typography-900">
              {title}
            </Text>
            {description ? (
              <Text size="md" className="text-typography-700">
                {description}
              </Text>
            ) : null}
          </Box>

          <Box className="px-5 pb-5 flex-row gap-3">
            <Button
              variant="outline"
              action="secondary"
              className="flex-1 rounded-xl"
              onPress={onCancel}
            >
              <ButtonText className="font-semibold">{cancelText}</ButtonText>
            </Button>
            <Button
              action="primary"
              variant="solid"
              className="flex-1 rounded-xl"
              onPress={onConfirm}
            >
              <ButtonText className="font-extrabold">{confirmText}</ButtonText>
            </Button>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
