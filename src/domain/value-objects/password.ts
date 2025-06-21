export class Password {
  private readonly value: string;

  constructor(password: string) {
    this.validate(password);
    this.value = password;
  }

  getValue(): string {
    return this.value;
  }

  private validate(password: string): void {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial');
    }

    if (errors.length > 0) {
      throw new Error(`Senha inválida: ${errors.join(', ')}`);
    }
  }

  toString(): string {
    return '[PROTECTED]';
  }
}
