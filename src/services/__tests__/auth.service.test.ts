import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { register, login } from "../auth.service";

const mockFindByEmail = jest.fn();
const mockCreate = jest.fn();

jest.mock("../../repositories/user.repository", () => ({
  findByEmail: (...args: unknown[]) => mockFindByEmail(...args),
  create: (...args: unknown[]) => mockCreate(...args),
}));

jest.mock("../../config/auth", () => ({ jwtConfig: { secret: "test-secret", expiresIn: "7d" } }));

describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("throws 409 when email already exists", async () => {
      mockFindByEmail.mockResolvedValue({ id: "1", email: "existing@test.com" });

      await expect(
        register({ name: "Test", email: "existing@test.com", password: "12345678" })
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(mockFindByEmail).toHaveBeenCalledWith("existing@test.com");
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("returns success message when registration succeeds", async () => {
      mockFindByEmail.mockResolvedValue(null);
      mockCreate.mockResolvedValue({});

      const result = await register({
        name: "Juan",
        email: "juan@test.com",
        password: "12345678",
      });

      expect(result).toEqual({ message: "Usuario registrado exitosamente" });
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("throws 401 when user not found", async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(
        login({ email: "none@test.com", password: "12345678" })
      ).rejects.toMatchObject({ statusCode: 401 });

      expect(mockFindByEmail).toHaveBeenCalledWith("none@test.com");
    });

    it("throws 401 when password does not match", async () => {
      const hashed = await bcrypt.hash("other", 10);
      mockFindByEmail.mockResolvedValue({
        id: "1",
        name: "Juan",
        email: "juan@test.com",
        password: hashed,
        role: "user",
      });

      await expect(
        login({ email: "juan@test.com", password: "wrongpassword" })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("returns token and user when credentials are valid", async () => {
      const hashed = await bcrypt.hash("12345678", 10);
      mockFindByEmail.mockResolvedValue({
        id: "user-1",
        name: "Juan",
        email: "juan@test.com",
        password: hashed,
        role: "user",
      });

      const result = await login({ email: "juan@test.com", password: "12345678" });

      expect(result.token).toBeDefined();
      expect(result.user).toEqual({
        id: "user-1",
        name: "Juan",
        email: "juan@test.com",
        role: "user",
      });
      expect(typeof result.token).toBe("string");
    });
  });
});
