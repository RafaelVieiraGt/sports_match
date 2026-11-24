import { CasualGame } from './CasualGame';
import { Cep } from './Cep';
import { EditPerfilDTO } from './EditPerfilDTO';
import { OpenGame } from './OpenGame';
import { Place } from './Place';
import { Position } from './Position';
import { Sports } from './Sports';
import { User } from './User';
import { UserDTO } from './UserDTO';
import { UserPhoto } from './UserPhoto';

describe('Models', () => {
  it('CasualGame should assign all fields', () => {
    const game = new CasualGame(1, 'Racha', 'Desc', 'Futebol', 'Quadra A', '10', -49, -22, 3, 1.5, 'url', 1, '2026-11-29');
    expect(game).toEqual(jasmine.objectContaining({
      openGameId: 1, openGameTitle: 'Racha', openGameDescription: 'Desc', sport: 'Futebol',
      placeName: 'Quadra A', maxPlayers: '10', gameLongitude: -49, gameLatitude: -22,
      actualPlayers: 3, realDistance: 1.5, urlPhoto: 'url', sportId: 1, date: '2026-11-29'
    }));
  });

  it('Cep should assign all fields', () => {
    expect(new Cep('17012-000', 'Rua A', 'Bauru', 'SP')).toEqual(jasmine.objectContaining({
      cep: '17012-000', logradouro: 'Rua A', localidade: 'Bauru', uf: 'SP'
    }));
  });

  it('EditPerfilDTO should assign all fields', () => {
    expect(new EditPerfilDTO('Nome', 'Desc', 'foto', 2)).toEqual(jasmine.objectContaining({
      nome: 'Nome', descricao: 'Desc', foto: 'foto', position: 2
    }));
  });

  it('OpenGame should assign all fields', () => {
    const day = new Date('2026-11-29T10:00:00');
    expect(new OpenGame(1, 'Racha', 'Desc', 1, 10, day, 3)).toEqual(jasmine.objectContaining({
      opengameId: 1, opengameTitle: 'Racha', opengameDesc: 'Desc', sport: 1,
      maxPlayers: 10, opengameDay: day, opengameLocation: 3
    }));
  });

  it('Place should assign all fields', () => {
    expect(new Place(1, 'Quadra', 'Desc', -49, -22)).toEqual(jasmine.objectContaining({
      placeId: 1, placeName: 'Quadra', placeDesc: 'Desc', placeLongitude: -49, placeLatitude: -22
    }));
  });

  it('Position should assign all fields', () => {
    expect(new Position(1, 'Goleiro', 'Desc', 1)).toEqual(jasmine.objectContaining({
      positionId: 1, positionName: 'Goleiro', positionDesc: 'Desc', sport: 1
    }));
  });

  it('Sports should assign all fields', () => {
    expect(new Sports(1, 'Futebol', 'Desc')).toEqual(jasmine.objectContaining({
      sportId: 1, sportName: 'Futebol', sportDescription: 'Desc'
    }));
  });

  it('User should assign all fields', () => {
    expect(new User(1, 'Rafael', 'Desc', '14999', 0, 2, 'Rua A', 3, true)).toEqual(jasmine.objectContaining({
      userId: 1, userName: 'Rafael', userDescription: 'Desc', userPhone: '14999', userActualTeam: 0,
      address: 2, addressStreet: 'Rua A', userFavPosition: 3, active: true
    }));
  });

  it('UserDTO should assign all fields', () => {
    expect(new UserDTO('Rafael', 'r@x.com', '123', 1, 2, '17012000')).toEqual(jasmine.objectContaining({
      name: 'Rafael', email: 'r@x.com', password: '123', sport: 1, position: 2, cep: '17012000'
    }));
  });

  it('UserPhoto should assign the photo', () => {
    expect(new UserPhoto('abc').foto).toBe('abc');
  });
});
