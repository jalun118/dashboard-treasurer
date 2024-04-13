export interface iUserObj {
  id: string | number;
  username: string;
  current_saldo: number;
  payment_debt: number;
}

export interface iUser {
  current_saldo: number;
  username: string;
  payment_debt: number;
  sid: string;
  presensi: number;
}
