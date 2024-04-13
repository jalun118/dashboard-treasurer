import { ObjectStandartResponse, ObjectStandartResponseWithError } from "@/interfaces/object-response";
import { errorsParse } from "@/interfaces/zod-type";
import { GenerateWithModel } from "@/utils/generate-string";
import { isEmpityString } from "@/utils/utils";
import { compareSync, hashSync } from "bcrypt";
import { z } from "zod";
import administratorModel, { iAdmin, iAdminSafe } from "./administrator.model";

type inputNewAdmin = {
  name: any;
  username: any;
  password: any;
  role?: any;
};

type ErrorNewAdmin = {
  name: string[];
  username: string[];
  password: string[];
};

async function AddNewAdmin(input: inputNewAdmin): Promise<ObjectStandartResponseWithError<any, ErrorNewAdmin>> {
  const schemaObject = z.object({
    name: z.string({
      required_error: "name must be filled",
      invalid_type_error: "name must be string"
    }),
    username: z.string({
      required_error: "username must be filled",
      invalid_type_error: "username must be string"
    }),
    password: z.string({
      required_error: "password must be filled",
      invalid_type_error: "password must be string"
    }),
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorNewAdmin = {
    name: [],
    password: [],
    username: []
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "name") errors.name.push(obj.message);
      if (obj.path[0] === "password") errors.password.push(obj.message);
      if (obj.path[0] === "username") errors.username.push(obj.message);
    });
  }

  if (!parser.success) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const inputDatas: dataSchemaType | null = parser?.data ?? null;

  if (isEmpityString(inputDatas?.name ?? "")) {
    errors.name.push("name must be filled");
  }

  if (isEmpityString(inputDatas?.username ?? "")) {
    errors.username.push("username must be filled");
  }

  if (isEmpityString(inputDatas?.password ?? "")) {
    errors.password.push("password must be filled");
  }

  if (isEmpityString(inputDatas?.name ?? "") || isEmpityString(inputDatas?.username ?? "") || isEmpityString(inputDatas?.password ?? "")) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const checkUser = await administratorModel.findOne({ username: inputDatas?.username });

  if (checkUser !== null) {
    errors.username.push("user already exists");

    return {
      success: false,
      errors: errors,
      data: null,
      message: "duplicate user"
    };
  }

  const hashPassword = hashSync(inputDatas?.password ?? "", 10);

  const newUser = new administratorModel({
    name: inputDatas?.name,
    username: inputDatas?.username,
    password: hashPassword,
    role: isEmpityString(input?.role ?? "") || input?.role !== "super-admin" ? "admin" : input?.role,
    sid: await GenerateWithModel(administratorModel, 20),
  });

  try {
    const result = await newUser.save();
    return {
      success: true,
      errors: null,
      data: result,
      message: "success to insert user"
    };
  } catch (error: any) {
    return {
      success: false,
      errors: null,
      data: null,
      message: error.message
    };
  }
}

async function GetOneAdmin(input_sid: any): Promise<ObjectStandartResponse<iAdminSafe>> {
  const schema = z.string({
    required_error: "sid is required",
    invalid_type_error: "sid is not a string"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(input_sid);

  if (!parser.success) {
    return {
      success: false,
      data: null,
      message: parser.error.errors[0].message
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  const queryFilter = {
    sid: data
  };

  try {
    const currentData = await administratorModel.findOne<iAdminSafe>(queryFilter, { password: 0, _id: 0, __v: 0 });

    if (!currentData) {
      return {
        success: false,
        data: null,
        message: "admin not found"
      };
    }

    return {
      success: true,
      data: currentData,
      message: "success to get one admin"
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}

type ErrorsLogin = {
  username: string[];
  password: string[];
};

type InputLogin = {
  username: any,
  password: any,
};

async function LoginAdmin(input: InputLogin): Promise<ObjectStandartResponseWithError<iAdmin, ErrorsLogin>> {
  const schemaObject = z.object({
    username: z.string({
      required_error: "username must be filled",
      invalid_type_error: "username must be string"
    }),
    password: z.string({
      required_error: "password must be filled",
      invalid_type_error: "password must be string"
    }),
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorsLogin = {
    password: [],
    username: []
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "password") errors.password.push(obj.message);
      if (obj.path[0] === "username") errors.username.push(obj.message);
    });
  }

  if (!parser.success) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const inputDatas: dataSchemaType | null = parser?.data ?? null;

  const query = {
    username: inputDatas?.username
  };

  try {
    const AdminAccount = await administratorModel.findOne<iAdmin>(query);

    if (!AdminAccount) {
      errors.username.push("username not found");

      return {
        success: false,
        errors: errors,
        data: null,
        message: "username not found"
      };
    }

    const comparePassword = compareSync(inputDatas?.password ?? "", AdminAccount.password);

    if (!comparePassword) {
      errors.password.push("password not matches");

      return {
        success: false,
        errors: errors,
        data: null,
        message: "password not matches"
      };
    }

    return {
      success: true,
      errors: null,
      data: AdminAccount,
      message: "password not matches"
    };
  } catch (err: any) {
    return {
      data: null,
      errors: null,
      success: false,
      message: err.message
    };
  }
}

async function GetAllAdmin(sid: string, withMe?: string | boolean): Promise<ObjectStandartResponse> {
  const query: any = {};

  if (withMe !== undefined && sid !== "") {
    if (withMe === "true" || withMe === true) {
      query.$nor = [{ sid: sid }];
    }
  }

  if (sid === "") {
    return {
      data: [],
      success: true,
      message: "success get all user"
    };
  }

  try {
    const getAllAdmins = await administratorModel.find<iAdminSafe>(query, { password: 0, _id: 0 });
    return {
      data: getAllAdmins,
      success: true,
      message: "success get all user"
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      message: err.message
    };
  }
}

type inputChangePassword = {
  sid: any;
  old_password: any;
  new_password: any;
};

type ErrorChangePassword = {
  sid: string[];
  old_password: string[];
  new_password: string[];
};

async function ChangePassword(input: inputChangePassword): Promise<ObjectStandartResponseWithError<iAdminSafe, ErrorChangePassword>> {
  const schemaObject = z.object({
    sid: z.string({
      required_error: "sid must be filled",
      invalid_type_error: "sid must be string"
    }),
    old_password: z.string({
      required_error: "old password must be filled",
      invalid_type_error: "old password must be string"
    }),
    new_password: z.string({
      required_error: "new password must be filled",
      invalid_type_error: "new password must be string"
    }),
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorChangePassword = {
    sid: [],
    old_password: [],
    new_password: [],
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "sid") errors.sid.push(obj.message);
      if (obj.path[0] === "old_password") errors.old_password.push(obj.message);
      if (obj.path[0] === "new_password") errors.new_password.push(obj.message);
    });
  }

  if (!parser.success) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const inputDatas: dataSchemaType | null = parser?.data ?? null;

  if (isEmpityString(inputDatas?.old_password ?? "")) {
    errors.old_password.push("old password must be filled");
  }

  if (isEmpityString(inputDatas?.new_password ?? "")) {
    errors.new_password.push("new password must be filled");
  }

  if (isEmpityString(inputDatas?.sid ?? "")) {
    errors.new_password.push("sid must be filled");
  }

  if (isEmpityString(inputDatas?.sid ?? "") || isEmpityString(inputDatas?.new_password ?? "") || isEmpityString(inputDatas?.old_password ?? "")) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const queryAdmin = {
    sid: inputDatas?.sid
  };

  const currentDataAdmin = await administratorModel.findOne<iAdmin>(queryAdmin);

  if (!currentDataAdmin) {
    errors.sid.push("sid no matches");
    return {
      success: false,
      data: null,
      errors: errors,
      message: "admin not found"
    };
  }

  const comparePassword = compareSync(inputDatas?.old_password ?? "", currentDataAdmin.password);

  if (!comparePassword) {
    errors.old_password.push("password no matches");
    return {
      success: false,
      data: null,
      errors: errors,
      message: "invalid password"
    };
  }

  const newPasswordHash = hashSync(inputDatas?.new_password ?? "", 10);

  const putData = {
    $set: {
      password: newPasswordHash
    }
  };

  try {
    const newData = await administratorModel.findOneAndUpdate(queryAdmin, putData, { projection: { _id: 0, password: 0 } });
    if (!newData) {
      errors.sid.push("sid no matches");
      return {
        success: false,
        data: null,
        errors: errors,
        message: "admin not found"
      };
    }

    return {
      success: true,
      data: newData,
      errors: null,
      message: "success to change password"
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      errors: null,
      message: error.message
    };
  }
}

type inputChangePasswordSuper = {
  sid: any;
  new_password: any;
};

type ErrorChangePasswordSuper = {
  sid: string[],
  new_password: string[],
};

async function ChangePasswordSuper(input: inputChangePasswordSuper): Promise<ObjectStandartResponseWithError<iAdminSafe, ErrorChangePasswordSuper>> {
  const schemaObject = z.object({
    sid: z.string({
      required_error: "sid must be filled",
      invalid_type_error: "sid must be string"
    }),
    new_password: z.string({
      required_error: "new password must be filled",
      invalid_type_error: "new password must be string"
    }),
  });

  type dataSchemaType = z.infer<typeof schemaObject>;

  const parser: any = schemaObject.safeParse(input);

  const errors: ErrorChangePasswordSuper = {
    sid: [],
    new_password: [],
  };

  if (!parser.success) {
    const errs: errorsParse[] = parser?.error?.errors;

    errs.forEach(obj => {
      if (obj.path[0] === "sid") errors.sid.push(obj.message);
      if (obj.path[0] === "new_password") errors.new_password.push(obj.message);
    });
  }

  if (!parser.success) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const inputDatas: dataSchemaType | null = parser?.data ?? null;

  if (isEmpityString(inputDatas?.new_password ?? "")) {
    errors.new_password.push("new password must be filled");
  }

  if (isEmpityString(inputDatas?.sid ?? "")) {
    errors.sid.push("sid must be filled");
  }

  if (isEmpityString(inputDatas?.sid ?? "") || isEmpityString(inputDatas?.new_password ?? "")) {
    return {
      success: false,
      errors: errors,
      data: null,
      message: "invalid type"
    };
  }

  const queryAdmin = {
    sid: inputDatas?.sid
  };

  const currentDataAdmin = await administratorModel.findOne<iAdmin>(queryAdmin);

  if (!currentDataAdmin) {
    errors.sid.push("sid no matches");
    return {
      success: false,
      data: null,
      errors: errors,
      message: "admin not found"
    };
  }

  const newPasswordHash = hashSync(inputDatas?.new_password ?? "", 10);

  const putData = {
    $set: {
      password: newPasswordHash
    }
  };

  try {
    const newData = await administratorModel.findOneAndUpdate(queryAdmin, putData, { projection: { _id: 0, password: 0 } });
    if (!newData) {
      errors.sid.push("sid no matches");
      return {
        success: false,
        data: null,
        errors: errors,
        message: "admin not found"
      };
    }

    return {
      success: true,
      data: newData,
      errors: null,
      message: "success to change password"
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      errors: null,
      message: error.message
    };
  }
}

async function DeleteAdmin(input_sid: any): Promise<ObjectStandartResponse<iAdminSafe>> {
  const schema = z.string({
    required_error: "sid is required",
    invalid_type_error: "sid is not a string"
  });

  type dataSchemaType = z.infer<typeof schema>;

  const parser: any = schema.safeParse(input_sid);

  if (!parser.success) {
    return {
      success: false,
      data: null,
      message: parser.error.errors[0].message
    };
  }

  const data: dataSchemaType | null = parser?.data ?? null;

  const queryFilter = {
    sid: data
  };

  try {
    const currentData = await administratorModel.findOneAndDelete(queryFilter, { projection: { password: 0 } });
    if (!currentData) {
      return {
        success: false,
        data: null,
        message: "admin not found"
      };
    }

    return {
      success: true,
      data: currentData,
      message: "success to delete admin"
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}

const administratorService = {
  AddNewAdmin,
  ChangePassword,
  ChangePasswordSuper,
  DeleteAdmin,
  GetAllAdmin,
  GetOneAdmin,
  LoginAdmin
};

export default administratorService;
