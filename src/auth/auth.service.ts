import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AuthResponse,
  LoginDto,
} from './dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import usersJson from '@db/users.json';
import { JwtService } from '@nestjs/jwt';
import { KorisnickiNalog } from 'src/modules/korisnicki-nalog/korisnicki-nalog.entity';
import * as bcrypt from 'bcrypt';
import { SifUloga } from 'src/modules/sif-uloga.entity/sif-uloga.entity';
import { Chef } from 'src/modules/chef/chef.entity';
import { literal } from 'sequelize';
import { ChefLocation } from 'src/modules/chef-location/chef-location.entity';
import { Location } from 'src/modules/location/location.entity';
import { SifPriceGroup } from '../modules/sif-price-group/sif-price-group.entity';

const users = plainToClass(User, usersJson);

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }
  private users: User[] = users;

  async login(loginInput: LoginDto): Promise<AuthResponse> {
    const user = await KorisnickiNalog.findOne({
      include: [
        {
          model: SifUloga,
          attributes: [
            'naziv'
          ]
        }
      ],
      where: {
        korisnicko_ime: loginInput.name,
      }
    })
    if (!user || !(await bcrypt.compare(loginInput.password, user.lozinka))) {
      return { token: "" };
    }
    const chef = await Chef.findOne({
      where: {
        korisnicki_nalog_id: user.id
      }
    })
    if (!chef || chef.status != 0)
      return { token: "" };
    if (user.sifUloga.naziv != 'manager')
      return { token: "" };
    const role = 'super_admin';
    const permissions = ['super_admin'];
    const chefLocation = await ChefLocation.findOne({
      include: [
        {
          model: Location,
          include: [
            {
              model: SifPriceGroup
            }
          ]
        }
      ],
      where: {
        chef_id: chef.id
      }
    })
    const token = this.jwtService.sign({
      user: {
        userName: user.korisnicko_ime,
        chefId: chef.id,
        chefName: `${chef.first_name} ${chef.last_name}`,
        role: user.sif_uloga_id,
        locationId: chefLocation.location.id,
        sifra: chefLocation.location.sifPriceGroup.sifra
      },
      role,
      permissions
    });
    await KorisnickiNalog.update({
      broj_logovanja: literal("broj_logovanja+1"),
      datum_poslednjeg_logovanja: new Date(),
    }, { where: { id: user.id } })
    return {
      token,
      permissions,
      role,
    };
  }

  async adminLogin(loginInput: LoginDto): Promise<AuthResponse> {
    const user = await KorisnickiNalog.findOne({
      include: [
        {
          model: SifUloga,
          attributes: [
            'naziv'
          ]
        }
      ],
      where: {
        korisnicko_ime: loginInput.name,
      }
    })
    if (!user || !(await bcrypt.compare(loginInput.password, user.lozinka))) {
      return { token: "" };
    }
    const chef = await Chef.findOne({
      where: {
        korisnicki_nalog_id: user.id
      }
    })
    if (!chef || chef.status != 0)
      return { token: "" };
    console.log(user.sifUloga.naziv)
    if (user.sifUloga.naziv != 'admin')
      return { token: "" };

    const role = 'super_admin';
    const permissions = ['super_admin'];
    const chefLocation = await ChefLocation.findOne({
      include: [
        {
          model: Location,
          include: [
            {
              model: SifPriceGroup
            }
          ]
        }
      ],
      where: {
        chef_id: chef.id
      }
    })
    const token = this.jwtService.sign({
      user: {
        userName: user.korisnicko_ime,
        chefId: chef.id,
        chefName: `${chef.first_name} ${chef.last_name}`,
        role: user.sif_uloga_id!,
        locationId: chefLocation?.location.id!,
        sifra: chefLocation?.location?.sifPriceGroup?.sifra!
      },
      role,
      permissions
    });
    await KorisnickiNalog.update({
      broj_logovanja: literal("broj_logovanja+1"),
      datum_poslednjeg_logovanja: new Date(),
    }, { where: { id: user.id } })
    return {
      token,
      permissions,
      role,
    };
  }
  async me() {
    return this.users[0];
  }
}
