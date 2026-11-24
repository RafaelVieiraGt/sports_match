import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CepMaskDirective } from './cep-mask.directive';

@Component({
  standalone: true,
  imports: [CepMaskDirective],
  template: `<input appCepMask />`
})
class HostComponent {}

describe('CepMaskDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let input: HTMLInputElement;

  const type = (value: string): string => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    return input.value;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('should create an instance', () => {
    const directive = new CepMaskDirective(new ElementRef(document.createElement('input')));
    expect(directive).toBeTruthy();
  });

  it('should keep up to 5 digits without a hyphen', () => {
    expect(type('12345')).toBe('12345');
  });

  it('should add the hyphen after the fifth digit', () => {
    expect(type('12345678')).toBe('12345-678');
  });

  it('should remove non numeric characters', () => {
    expect(type('12a.34-5b67')).toBe('12345-67');
  });

  it('should limit the CEP to 8 digits', () => {
    expect(type('1234567890')).toBe('12345-678');
  });

  it('should re-format a value that already has a hyphen', () => {
    expect(type('12345-678')).toBe('12345-678');
  });

  it('should leave an empty value empty', () => {
    expect(type('abc')).toBe('');
  });
});
