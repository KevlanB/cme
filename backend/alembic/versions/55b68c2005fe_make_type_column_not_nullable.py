"""make type column not nullable

Revision ID: 55b68c2005fe
Revises: 679584452200
Create Date: 2025-04-10 20:08:22.094349

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '55b68c2005fe'
down_revision: Union[str, None] = '679584452200'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('materials', 'type', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    pass
