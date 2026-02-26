import { getProfile, listUsers, updateProfile } from "../users.service";

const mockFindById = jest.fn();
const mockUpdateById = jest.fn();
const mockFindManyPaginated = jest.fn();

jest.mock("../../repositories/user.repository", () => ({
  findById: (...args: unknown[]) => mockFindById(...args),
  updateById: (...args: unknown[]) => mockUpdateById(...args),
  findManyPaginated: (...args: unknown[]) => mockFindManyPaginated(...args),
}));

describe("users.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("throws 404 when user not found", async () => {
      mockFindById.mockResolvedValue(null);

      await expect(getProfile("missing-id")).rejects.toMatchObject({
        statusCode: 404,
      });

      expect(mockFindById).toHaveBeenCalledWith("missing-id");
    });

    it("returns user DTO when user exists", async () => {
      mockFindById.mockResolvedValue({
        id: "user-1",
        name: "María",
        email: "maria@test.com",
        role: "user",
      });

      const result = await getProfile("user-1");

      expect(result).toEqual({
        id: "user-1",
        name: "María",
        email: "maria@test.com",
        role: "user",
      });
      expect(mockFindById).toHaveBeenCalledWith("user-1");
    });
  });

  describe("updateProfile", () => {
    it("throws 404 when user not found", async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        updateProfile("missing-id", { name: "Nuevo nombre" })
      ).rejects.toMatchObject({ statusCode: 404 });

      expect(mockFindById).toHaveBeenCalledWith("missing-id");
      expect(mockUpdateById).not.toHaveBeenCalled();
    });

    it("throws 500 when update returns null", async () => {
      mockFindById.mockResolvedValue({
        id: "user-1",
        name: "Old",
        email: "u@test.com",
        role: "user",
      });
      mockUpdateById.mockResolvedValue(null);

      await expect(
        updateProfile("user-1", { name: "New Name" })
      ).rejects.toMatchObject({ statusCode: 500 });

      expect(mockUpdateById).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({ name: "New Name" })
      );
    });

    it("returns message and user when update succeeds", async () => {
      mockFindById.mockResolvedValue({
        id: "user-1",
        name: "Old",
        email: "u@test.com",
        role: "user",
      });
      mockUpdateById.mockResolvedValue({
        id: "user-1",
        name: "New Name",
        email: "u@test.com",
        role: "user",
      });

      const result = await updateProfile("user-1", { name: "New Name" });

      expect(result).toEqual({
        message: "Perfil actualizado",
        user: {
          id: "user-1",
          name: "New Name",
          email: "u@test.com",
          role: "user",
        },
      });
      expect(mockUpdateById).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({ name: "New Name" })
      );
    });
  });

  describe("listUsers", () => {
    it("returns users and pagination", async () => {
      mockFindManyPaginated.mockResolvedValue({
        rows: [
          { id: "1", name: "Admin", email: "admin@test.com", role: "admin" },
          { id: "2", name: "User", email: "user@test.com", role: "user" },
        ],
        total: 2,
      });

      const result = await listUsers(1, 10);

      expect(result.users).toHaveLength(2);
      expect(result.users[0]).toEqual({
        id: "1",
        name: "Admin",
        email: "admin@test.com",
        role: "admin",
      });
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
      expect(mockFindManyPaginated).toHaveBeenCalledWith(10, 0);
    });

    it("calculates offset and totalPages correctly", async () => {
      mockFindManyPaginated.mockResolvedValue({
        rows: [{ id: "1", name: "A", email: "a@t.com", role: "user" }],
        total: 25,
      });

      const result = await listUsers(2, 10);

      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
      });
      expect(mockFindManyPaginated).toHaveBeenCalledWith(10, 10);
    });
  });
});
