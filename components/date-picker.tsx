import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import dayjs from "@/lib/dayjs";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import { Modal, Platform, Pressable } from "react-native";

export type DatePickerProps = {
  disabled?: boolean;
  handleSelect: (next: Date) => void;
  label?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  value: Date;
};

export function DatePicker({
  disabled = false,
  handleSelect,
  label,
  maximumDate = dayjs().add(6, "months").toDate(),
  minimumDate = dayjs().toDate(),
  value,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(value);

  const displayValue = useMemo(() => {
    return dayjs(value).format("dddd, MMMM D, YYYY");
  }, [value]);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === "dismissed") {
      setOpen(false);
      return;
    }
    if (!selected) return;

    if (Platform.OS === "android") {
      setOpen(false);
      handleSelect(selected);
      return;
    }

    setDraft(selected);
  };

  return (
    <Box className="gap-3">
      {label ? (
        <Text size="md" weight="extrabold" className="text-typography-500">
          {label}
        </Text>
      ) : null}

      <Button
        variant="outline"
        action="secondary"
        size="xl"
        isDisabled={disabled}
        className="justify-start bg-background-0 border-2 border-outline-200 rounded-xl px-2"
        onPress={() => {
          setDraft(value);
          setOpen(true);
        }}
      >
        <ButtonText className="text-typography-900 text-lg font-bold">
          {displayValue}
        </ButtonText>
      </Button>

      {Platform.OS === "android" && open && (
        <DateTimePicker
          value={value}
          mode={"date"}
          display={"default"}
          disabled={disabled}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
          testID="dateTimePicker"
        />
      )}

      {Platform.OS === "ios" ? (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable
            className="flex-1 bg-black/50 px-5 justify-center"
            onPress={() => setOpen(false)}
          >
            <Pressable className="bg-background-0 rounded-2xl border border-outline-200">
              <Box className="px-4 py-3 border-b border-outline-200 flex-row items-center justify-between">
                <Button
                  variant="link"
                  action="secondary"
                  className="px-0"
                  onPress={() => setOpen(false)}
                >
                  <ButtonText className="text-typography-700 font-semibold">
                    Cancel
                  </ButtonText>
                </Button>

                <Text weight="bold" className="text-typography-900">
                  Select date
                </Text>

                <Button
                  variant="link"
                  action="primary"
                  className="px-0"
                  onPress={() => {
                    setOpen(false);
                    handleSelect(draft);
                  }}
                >
                  <ButtonText className="text-primary-600 font-extrabold">
                    Done
                  </ButtonText>
                </Button>
              </Box>

              <Box className="px-4 py-4">
                <DateTimePicker
                  value={draft}
                  mode={"date"}
                  display={"inline"}
                  disabled={disabled}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  onChange={handleChange}
                  testID="dateTimePicker"
                />
              </Box>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </Box>
  );
}
