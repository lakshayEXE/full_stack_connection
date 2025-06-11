import { TestBed } from '@angular/core/testing';

import { LoginRedirect } from './login-redirect';

describe('LoginRedirect', () => {
  let service: LoginRedirect;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginRedirect);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
