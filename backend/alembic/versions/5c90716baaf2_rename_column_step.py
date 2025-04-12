"""rename column step

Revision ID: 5c90716baaf2
Revises: 55b68c2005fe
Create Date: 2025-04-11 17:24:43.633314

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5c90716baaf2'
down_revision: Union[str, None] = '55b68c2005fe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
