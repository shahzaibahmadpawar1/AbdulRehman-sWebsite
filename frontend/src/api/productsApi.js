import { request } from "./httpClient";

export function getProducts() {
  return request("/products");
}
