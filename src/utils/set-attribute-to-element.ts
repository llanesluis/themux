export const DATA_KEYS = {
  preset: "data-preset",
  primary: "data-primary",
  surface: "data-surface",
  variant: "data-variant",
} as const;

export type DataKey = (typeof DATA_KEYS)[keyof typeof DATA_KEYS];

export function setStyleProperty({
  element,
  value,
  key,
}: {
  element: HTMLElement;
  key: DataKey;
  value: string;
}) {
  element.style.setProperty(key, value);
}

export function setAttributeToElement({
  element,
  attribute,
  value,
}: {
  element: HTMLElement;
  attribute: DataKey;
  value: string;
}) {
  if (element) {
    element.setAttribute(attribute, value);
  }
}

export function getAttributeFromElement({
  element,
  attribute,
}: {
  element: HTMLElement;
  attribute: DataKey;
}) {
  if (element) {
    return element.getAttribute(attribute);
  }
}
