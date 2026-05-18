declare module "nodemailer" {
  type SendMailOptions = {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
  };

  type Transporter = {
    sendMail(options: SendMailOptions): Promise<unknown>;
  };

  type TransportOptions = {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  };

  function createTransport(options: TransportOptions): Transporter;

  export = {
    createTransport,
  };
}
